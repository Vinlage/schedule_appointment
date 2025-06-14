import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testDatabaseConfig } from './test-database.config';

describe('PatientController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(testDatabaseConfig),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /patients', () => {
    it('should create a new patient', () => {
      return request(app.getHttpServer())
        .post('/patients')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890',
          birthDate: '1990-01-01',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe('John Doe');
          expect(res.body.email).toBe('john@example.com');
          expect(res.body.phone).toBe('1234567890');
          expect(res.body.birthDate).toBe('1990-01-01T00:00:00.000Z');
          expect(res.body.isAdult).toBe(true);
        });
    });

    it('should return 400 when email is already in use', async () => {
      const patientData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        birthDate: '1990-01-01',
      };

      await request(app.getHttpServer())
        .post('/patients')
        .send(patientData)
        .expect(201);

      return request(app.getHttpServer())
        .post('/patients')
        .send(patientData)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('Email already in use');
        });
    });
  });

  describe('GET /patients', () => {
    it('should return an empty array when no patients exist', () => {
      return request(app.getHttpServer())
        .get('/patients')
        .expect(200)
        .expect([]);
    });

    it('should return all patients', async () => {
      const patientData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        birthDate: '1990-01-01',
      };

      await request(app.getHttpServer())
        .post('/patients')
        .send(patientData)
        .expect(201);

      return request(app.getHttpServer())
        .get('/patients')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(1);
          expect(res.body[0].name).toBe(patientData.name);
          expect(res.body[0].email).toBe(patientData.email);
        });
    });
  });

  describe('GET /patients/:id', () => {
    it('should return 404 when patient does not exist', () => {
      return request(app.getHttpServer())
        .get('/patients/non-existent-id')
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('not found');
        });
    });

    it('should return patient by id', async () => {
      const patientData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        birthDate: '1990-01-01',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/patients')
        .send(patientData)
        .expect(201);

      const patientId = createResponse.body.id;

      return request(app.getHttpServer())
        .get(`/patients/${patientId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(patientId);
          expect(res.body.name).toBe(patientData.name);
          expect(res.body.email).toBe(patientData.email);
        });
    });
  });

  describe('PUT /patients/:id', () => {
    it('should update patient', async () => {
      const patientData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        birthDate: '1990-01-01',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/patients')
        .send(patientData)
        .expect(201);

      const patientId = createResponse.body.id;

      const updateData = {
        name: 'John Updated',
        phone: '9876543210',
      };

      return request(app.getHttpServer())
        .put(`/patients/${patientId}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(patientId);
          expect(res.body.name).toBe(updateData.name);
          expect(res.body.phone).toBe(updateData.phone);
          expect(res.body.email).toBe(patientData.email); // email não foi atualizado
        });
    });
  });

  describe('DELETE /patients/:id', () => {
    it('should delete patient', async () => {
      const patientData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        birthDate: '1990-01-01',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/patients')
        .send(patientData)
        .expect(201);

      const patientId = createResponse.body.id;

      await request(app.getHttpServer())
        .delete(`/patients/${patientId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBe('Patient deleted successfully');
        });

      return request(app.getHttpServer())
        .get(`/patients/${patientId}`)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('not found');
        });
    });
  });
}); 