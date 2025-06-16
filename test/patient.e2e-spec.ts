import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

interface PatientResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  isAdult: boolean;
}

interface ErrorResponse {
  message: string;
  statusCode: number;
  timestamp: string;
}

describe('PatientController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/patients (POST)', () => {
    const createPatientDto = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      birthDate: '1990-01-01',
    };

    return request(app.getHttpServer())
      .post('/patients')
      .send(createPatientDto)
      .expect(201)
      .expect((res) => {
        const patient = res.body as PatientResponse;
        expect(patient.name).toBe(createPatientDto.name);
        expect(patient.email).toBe(createPatientDto.email);
        expect(patient.phone).toBe(createPatientDto.phone);
        expect(patient.birthDate).toBe(createPatientDto.birthDate);
        expect(patient.isAdult).toBe(true);
      });
  });

  it('/patients (GET)', () => {
    return request(app.getHttpServer())
      .get('/patients')
      .expect(200)
      .expect((res) => {
        const patients = res.body as PatientResponse[];
        expect(Array.isArray(patients)).toBe(true);
        expect(patients.length).toBeGreaterThan(0);
        expect(patients[0]).toHaveProperty('id');
        expect(patients[0]).toHaveProperty('name');
      });
  });

  it('/patients/:id (GET)', async () => {
    // Primeiro, criar um paciente
    const createPatientDto = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '0987654321',
      birthDate: '1995-01-01',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/patients')
      .send(createPatientDto);

    const createdPatient = createResponse.body as PatientResponse;
    const patientId = createdPatient.id;

    // Depois, buscar o paciente pelo ID
    return request(app.getHttpServer())
      .get(`/patients/${patientId}`)
      .expect(200)
      .expect((res) => {
        const patient = res.body as PatientResponse;
        expect(patient.id).toBe(patientId);
        expect(patient.name).toBe(createPatientDto.name);
        expect(patient.email).toBe(createPatientDto.email);
      });
  });

  it('/patients/:id (PATCH)', async () => {
    // Primeiro, criar um paciente
    const createPatientDto = {
      name: 'Bob Smith',
      email: 'bob@example.com',
      phone: '5555555555',
      birthDate: '1985-01-01',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/patients')
      .send(createPatientDto);

    const createdPatient = createResponse.body as PatientResponse;
    const patientId = createdPatient.id;

    // Depois, atualizar o paciente
    const updatePatientDto = {
      name: 'Bob Johnson',
      phone: '6666666666',
    };

    return request(app.getHttpServer())
      .patch(`/patients/${patientId}`)
      .send(updatePatientDto)
      .expect(200)
      .expect((res) => {
        const patient = res.body as PatientResponse;
        expect(patient.id).toBe(patientId);
        expect(patient.name).toBe(updatePatientDto.name);
        expect(patient.phone).toBe(updatePatientDto.phone);
        expect(patient.email).toBe(createPatientDto.email); // Email não foi alterado
      });
  });

  it('/patients/:id (DELETE)', async () => {
    // Primeiro, criar um paciente
    const createPatientDto = {
      name: 'Alice Brown',
      email: 'alice@example.com',
      phone: '7777777777',
      birthDate: '1992-01-01',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/patients')
      .send(createPatientDto);

    const createdPatient = createResponse.body as PatientResponse;
    const patientId = createdPatient.id;

    // Depois, deletar o paciente
    await request(app.getHttpServer())
      .delete(`/patients/${patientId}`)
      .expect(200);

    // Verificar se o paciente foi realmente deletado
    return request(app.getHttpServer())
      .get(`/patients/${patientId}`)
      .expect(404)
      .expect((res) => {
        const error = res.body as ErrorResponse;
        expect(error.message).toBe('Patient not found');
      });
  });
});
