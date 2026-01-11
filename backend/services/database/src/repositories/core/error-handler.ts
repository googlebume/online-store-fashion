/**
 * Error handling - SOLID Principle: Single Responsibility
 */
export class RepositoryError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'RepositoryError';
  }
}

export class EntityNotFoundError extends RepositoryError {
  constructor(entityName: string, id: string | number) {
    super(
      'ENTITY_NOT_FOUND',
      `${entityName} with id ${id} not found`,
      404
    );
  }
}

export class EntityAlreadyExistsError extends RepositoryError {
  constructor(entityName: string, field: string, value: any) {
    super(
      'ENTITY_ALREADY_EXISTS',
      `${entityName} with ${field} "${value}" already exists`,
      409
    );
  }
}

export class ValidationError extends RepositoryError {
  constructor(message: string) {
    super('VALIDATION_ERROR', message, 400);
  }
}

export class DatabaseError extends RepositoryError {
  constructor(message: string, originalError?: Error) {
    super('DATABASE_ERROR', message, 500, originalError);
  }
}

/**
 * Error handler utility
 */
export class ErrorHandler {
  static handlePrismaError(error: any, entityName: string): never {
    // P2002 - Unique constraint failed
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'unknown field';
      throw new EntityAlreadyExistsError(entityName, field, error.meta?.target);
    }

    // P2025 - Record not found
    if (error.code === 'P2025') {
      throw new EntityNotFoundError(entityName, error.meta?.cause);
    }

    throw new DatabaseError(error.message || 'Database operation failed', error);
  }

  static handleError(error: any, entityName: string): never {
    if (error instanceof RepositoryError) {
      throw error;
    }

    if (error.code) {
      this.handlePrismaError(error, entityName);
    }

    throw new DatabaseError(error.message || 'Unknown error occurred', error);
  }
}
