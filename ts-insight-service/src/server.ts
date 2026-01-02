/**
 * Express server for product insights microservice
 */
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { calculateInsights } from './insights';
import { ProductInput } from './types';

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

/**
 * Validate product input
 */
function isValidProduct(product: unknown): product is ProductInput {
  if (typeof product !== 'object' || product === null) {
    return false;
  }

  const p = product as Record<string, unknown>;

  return (
    typeof p.name === 'string' &&
    typeof p.price === 'number' &&
    (p.rating === null || typeof p.rating === 'number') &&
    typeof p.stock === 'number'
  );
}

/**
 * Health check endpoint
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

/**
 * POST /insights - Analyze products and return insights
 */
app.post('/insights', (req: Request, res: Response) => {
  try {
    // Validate request body
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        error: 'Invalid request body. Expected an object with a "products" array.',
      });
    }

    const { products } = req.body;

    // Validate products array
    if (!Array.isArray(products)) {
      return res.status(400).json({
        error: 'Invalid request body. "products" must be an array.',
      });
    }

    // Validate each product
    const invalidProducts: number[] = [];
    products.forEach((product: unknown, index: number) => {
      if (!isValidProduct(product)) {
        invalidProducts.push(index);
      }
    });

    if (invalidProducts.length > 0) {
      return res.status(400).json({
        error: 'Invalid product data',
        details: `Products at indices ${invalidProducts.join(', ')} are invalid. Each product must have: name (string), price (number), rating (number | null), stock (number).`,
      });
    }

    // Calculate insights
    const insights = calculateInsights(products as ProductInput[]);

    return res.status(200).json(insights);
  } catch (error) {
    // Log error with context
    console.error('Error processing insights request:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      body: req.body,
    });

    // Return generic error (don't expose stack traces)
    return res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while processing your request.',
    });
  }
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: express.NextFunction) => {
  console.error('Unhandled error:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
  });

  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred.',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Insights service running on http://localhost:${PORT}`);
  console.log(`📊 POST /insights - Analyze products`);
  console.log(`❤️  GET /health - Health check`);
});

