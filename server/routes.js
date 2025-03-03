import express from 'express';
import db from './database.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all API services with their keys and models
router.get('/services', async (req, res) => {
  try {
    // Get all services
    const services = await db.query(
      'SELECT id, name, base_url as baseUrl FROM api_services'
    );

    // For each service, get its API keys and models
    const servicesWithDetails = await Promise.all(services.map(async (service) => {
      // Get API keys for this service
      const apiKeys = await db.query(
        'SELECT id, name, key_value as `key` FROM api_keys WHERE service_id = ?',
        [service.id]
      );

      // Get models for this service
      const modelsResult = await db.query(
        'SELECT model_name FROM api_models WHERE service_id = ?',
        [service.id]
      );
      
      const models = modelsResult.map(model => model.model_name);

      // Return the complete service object
      return {
        ...service,
        apiKeys,
        models
      };
    }));

    res.json(servicesWithDetails);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Add a new API service
router.post('/services', async (req, res) => {
  try {
    const { name, baseUrl, apiKeys, models } = req.body;
    
    if (!name || !baseUrl) {
      return res.status(400).json({ error: 'Name and baseUrl are required' });
    }

    const serviceId = uuidv4();
    
    // Begin transaction
    const connection = await db.pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Insert the service
      await connection.query(
        'INSERT INTO api_services (id, name, base_url) VALUES (?, ?, ?)',
        [serviceId, name, baseUrl]
      );

      // Insert API keys if provided
      if (apiKeys && apiKeys.length > 0) {
        for (const key of apiKeys) {
          const keyId = key.id || uuidv4();
          await connection.query(
            'INSERT INTO api_keys (id, service_id, name, key_value) VALUES (?, ?, ?, ?)',
            [keyId, serviceId, key.name, key.key]
          );
        }
      }

      // Insert models if provided
      if (models && models.length > 0) {
        for (const model of models) {
          await connection.query(
            'INSERT INTO api_models (service_id, model_name) VALUES (?, ?)',
            [serviceId, model]
          );
        }
      }

      await connection.commit();
      
      // Return the newly created service
      res.status(201).json({
        id: serviceId,
        name,
        baseUrl,
        apiKeys: apiKeys || [],
        models: models || []
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error adding service:', error);
    res.status(500).json({ error: 'Failed to add service' });
  }
});

// Update an existing API service
router.put('/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, baseUrl, apiKeys, models } = req.body;
    
    if (!name || !baseUrl) {
      return res.status(400).json({ error: 'Name and baseUrl are required' });
    }

    // Check if service exists
    const existingService = await db.query(
      'SELECT id FROM api_services WHERE id = ?',
      [id]
    );
    
    if (existingService.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Begin transaction
    const connection = await db.pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Update the service
      await connection.query(
        'UPDATE api_services SET name = ?, base_url = ? WHERE id = ?',
        [name, baseUrl, id]
      );

      // Delete existing keys and models to replace them
      await connection.query('DELETE FROM api_keys WHERE service_id = ?', [id]);
      await connection.query('DELETE FROM api_models WHERE service_id = ?', [id]);

      // Insert API keys if provided
      if (apiKeys && apiKeys.length > 0) {
        for (const key of apiKeys) {
          const keyId = key.id || uuidv4();
          await connection.query(
            'INSERT INTO api_keys (id, service_id, name, key_value) VALUES (?, ?, ?, ?)',
            [keyId, id, key.name, key.key]
          );
        }
      }

      // Insert models if provided
      if (models && models.length > 0) {
        for (const model of models) {
          await connection.query(
            'INSERT INTO api_models (service_id, model_name) VALUES (?, ?)',
            [id, model]
          );
        }
      }

      await connection.commit();
      
      // Return the updated service
      res.json({
        id,
        name,
        baseUrl,
        apiKeys: apiKeys || [],
        models: models || []
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// Delete an API service
router.delete('/services/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if service exists
    const existingService = await db.query(
      'SELECT id FROM api_services WHERE id = ?',
      [id]
    );
    
    if (existingService.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Delete the service (cascade will delete related keys and models)
    await db.query('DELETE FROM api_services WHERE id = ?', [id]);
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

export default router;
