require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Admin = require('../models/Admin');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Room = require('../models/Room');
const Session = require('../models/Session');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB for seeding...');
};

const clearAll = async () => {
  await Promise.all([
    Admin.deleteMany({}), Doctor.deleteMany({}), Patient.deleteMany({}),
    Room.deleteMany({}), Session.deleteMany({}),
    Appointment.deleteMany({}), Prescription.deleteMany({}),
  ]);
  console.log('🗑️  Cleared all existing data');
};

const seedAdmins = async () => {
  const hash = (pw) => bcrypt.hash(pw, 12);
  const admins = [
    { fullName: 'Dr. Admin User', email: 'admin@behealthy.com', eid: 'EID-0001', password: await hash('admin123'), role: 'admin', title: 'Hospital Administrator' },
    { fullName: 'Sarah Staff', email: 'staff@behealthy.com', eid: 'EID-0002', password: await hash('staff123'), role: 'staff', title: 'Front Desk Staff' },
  ];
  const created = await Admin.insertMany(admins);
  console.log(`✅ Seeded ${created.length} admin accounts`);
  return created;
};

const seedDoctors = async () => {
  const hash = (pw) => bcrypt.hash(pw, 12);
  const doctorsData = [
    { fullName: 'Dr. Sarah Jenkins', email: 'sarah.jenkins@behealthy.com', nic: '880120-1234567', specialization: 'Cardiology', contactNumber: '+94 71 234 5678', yearsOfExperience: 12, licenseNumber: 'LIC-0001', status: 'Approved', availability: 'Available', password: await hash('doctor123'), bio: 'Senior Cardiologist with 12 years of experience.' },
    { fullName: 'Dr. Emily Rodriguez', email: 'emily.rodriguez@behealthy.com', nic: '890210-2345678', specialization: 'Pediatrics', contactNumber: '+94 72 345 6789', yearsOfExperience: 8, licenseNumber: 'LIC-0002', status: 'Approved', availability: 'Available', password: await hash('doctor123'), bio: 'Pediatric specialist focused on child wellness.' },
    { fullName: 'Dr. Marcus Thorne', email: 'marcus.thorne@behealthy.com', nic: '870315-3456789', specialization: 'Neurology', contactNumber: '+94 73 456 7890', yearsOfExperience: 15, licenseNumber: 'LIC-0003', status: 'Approved', availability: 'Available', password: await hash('doctor123'), bio: 'Expert neurologist specializing in brain disorders.' },
    { fullName: 'Dr. James Wilson', email: 'james.wilson@behealthy.com', nic: '860420-4567890', specialization: 'Orthopedics', contactNumber: '+94 74 567 8901', yearsOfExperience: 10, licenseNumber: 'LIC-0004', status: 'Approved', availability: 'Available', password: await hash('doctor123'), bio: 'Orthopedic surgeon with expertise in joint replacement.' },
    { fullName: 'Dr. Lisa Chen', email: 'lisa.chen@behealthy.com', nic: '910525-5678901', specialization: 'Endocrinology', contactNumber: '+94 75 678 9012', yearsOfExperience: 7, licenseNumber: 'LIC-0005', status: 'Approved', availability: 'Unavailable', password: await hash('doctor123'), bio: 'Endocrinology and diabetes management specialist.' },
    { fullName: 'Dr. Alan Smith', email: 'alan.smith@behealthy.com', nic: '850630-6789012', specialization: 'Cardiology', contactNumber: '+94 76 789 0123', yearsOfExperience: 18, licenseNumber: 'LIC-0006', status: 'Approved', availability: 'Available', password: await hash('doctor123'), bio: 'Veteran cardiologist with 18 years of practice.' },
    { fullName: 'Dr. Elena Rodriguez', email: 'elena.rodriguez@behealthy.com', nic: '920735-7890123', specialization: 'Dermatology', contactNumber: '+94 77 890 1234', yearsOfExperience: 5, licenseNumber: 'LIC-0007', status: 'Approved', availability: 'Available', password: await hash('doctor123'), bio: 'Dermatology specialist for skin and hair conditions.' },
    { fullName: 'Dr. Michael Chen', email: 'michael.chen@behealthy.com', nic: '900840-8901234', specialization: 'General Medicine', contactNumber: '+94 78 901 2345', yearsOfExperience: 9, licenseNumber: 'LIC-0008', status: 'Pending', availability: 'Unavailable', password: await hash('doctor123'), bio: 'General practitioner awaiting approval.' },
    { fullName: 'Dr. Mark Ruffalo', email: 'mark.ruffalo@behealthy.com', nic: '940945-9012345', specialization: 'Radiology', contactNumber: '+94 79 012 3456', yearsOfExperience: 6, licenseNumber: 'LIC-0009', status: 'Pending', availability: 'Unavailable', password: await hash('doctor123'), bio: 'Radiologist with experience in diagnostic imaging.' },
    { fullName: 'Dr. Emily Chen', email: 'emily.chen@behealthy.com', nic: '881050-0123456', specialization: 'Cardiology', contactNumber: '+94 70 123 4567', yearsOfExperience: 11, licenseNumber: 'LIC-0010', status: 'Approved', availability: 'Available', password: await hash('doctor123'), bio: 'Cardiology expert with focus on preventive care.' },
  ];
  const created = await Doctor.insertMany(doctorsData);
  console.log(`✅ Seeded ${created.length} doctors`);
  return created;
};

const seedPatients = async () => {
  const hash = (pw) => bcrypt.hash(pw, 12);
  const patientsData = [
    { fullName: 'Alice Johnson', email: 'alice@example.com', nic: '901125-1111111', password: await hash('patient123'), dateOfBirth: new Date('1990-05-14'), gender: 'female', contactNumber: '+94 71 111 2222', address: '12 Galle Road, Colombo', bloodGroup: 'A+', status: 'Stable', patientId: 'PT-1001', lastVisit: new Date('2026-04-10') },
    { fullName: 'Bob Smith', email: 'bob@example.com', nic: '720228-2222222', password: await hash('patient123'), dateOfBirth: new Date('1972-03-15'), gender: 'male', contactNumber: '+94 72 222 3333', address: '45 Kandy Road, Peradeniya', bloodGroup: 'O+', status: 'Critical', patientId: 'PT-1002', lastVisit: new Date('2026-04-18') },
    { fullName: 'Charlie Davis', email: 'charlie@example.com', nic: '980330-3333333', password: await hash('patient123'), dateOfBirth: new Date('1998-07-22'), gender: 'male', contactNumber: '+94 73 333 4444', address: '78 Temple Road, Nugegoda', bloodGroup: 'B-', status: 'Recovering', patientId: 'PT-1003', lastVisit: new Date('2026-04-15') },
    { fullName: 'John Doe', email: 'john.doe@example.com', nic: '850404-4444444', password: await hash('patient123'), dateOfBirth: new Date('1985-09-10'), gender: 'male', contactNumber: '+94 74 444 5555', address: '23 Marine Drive, Colombo', bloodGroup: 'AB+', status: 'Stable', patientId: 'PT-1004', lastVisit: new Date('2026-04-12') },
    { fullName: 'Amara Silva', email: 'amara@example.com', nic: '950505-5555555', password: await hash('patient123'), dateOfBirth: new Date('1995-11-05'), gender: 'female', contactNumber: '+94 75 555 6666', address: '56 Hill Street, Kandy', bloodGroup: 'A-', status: 'Active', patientId: 'PT-1005', lastVisit: new Date('2026-04-16') },
    { fullName: 'Alex Johnson', email: 'alex.j@example.com', nic: '881215-6666666', password: await hash('patient123'), dateOfBirth: new Date('1988-12-20'), gender: 'male', contactNumber: '+94 76 666 7777', address: '90 Park Avenue, Colombo', bloodGroup: 'O-', status: 'Stable', patientId: 'PT-8821', lastVisit: new Date('2026-04-19') },
    { fullName: 'Sarah Thompson', email: 'sarah.t@example.com', nic: '920606-7777777', password: await hash('patient123'), dateOfBirth: new Date('1992-06-18'), gender: 'female', contactNumber: '+94 77 777 8888', address: '34 Lake Road, Colombo', bloodGroup: 'B+', status: 'Stable', patientId: 'PT-4421', lastVisit: new Date('2026-04-17') },
    { fullName: 'Robert Wilson', email: 'robert.w@example.com', nic: '780707-8888888', password: await hash('patient123'), dateOfBirth: new Date('1978-08-30'), gender: 'male', contactNumber: '+94 78 888 9999', address: '67 Main Street, Galle', bloodGroup: 'A+', status: 'Stable', patientId: 'PT-3928', lastVisit: new Date('2026-04-14') },
  ];
  const created = await Patient.insertMany(patientsData);
  console.log(`✅ Seeded ${created.length} patients`);
  return created;
};

const seedRooms = async () => {
  const roomsData = [
    { roomNumber: '101', name: 'Room 101', type: 'General Ward', floor: 'Ground Floor', status: 'Occupied', currentOccupant: { name: 'Alice Johnson', admittedAt: new Date('2026-04-15'), condition: 'Stable' } },
    { roomNumber: '102', name: 'Room 102', type: 'General Ward', floor: 'Ground Floor', status: 'Available', lastCleaned: new Date('2026-04-20') },
    { roomNumber: '104', name: 'Consultation Room 104', type: 'Consultation', floor: 'Ground Floor', status: 'Available' },
    { roomNumber: '108', name: 'Consultation Room 108', type: 'Consultation', floor: 'Ground Floor', status: 'Available' },
    { roomNumber: '112', name: 'Room 112', type: 'Private Suite', floor: 'Ground Floor', status: 'Maintenance', notes: 'AC unit repair in progress' },
    { roomNumber: '202', name: 'Room 202', type: 'General Ward', floor: '2nd Floor', status: 'Occupied', currentOccupant: { name: 'Bob Smith', admittedAt: new Date('2026-04-18'), condition: 'Critical' } },
    { roomNumber: '205', name: 'Consultation Room 205', type: 'Consultation', floor: '2nd Floor', status: 'Available' },
    { roomNumber: '208', name: 'Room 208', type: 'Private Suite', floor: '2nd Floor', status: 'Occupied', currentOccupant: { name: 'Charlie Davis', admittedAt: new Date('2026-04-14'), condition: 'Recovering' } },
    { roomNumber: '302', name: 'Consultation Room 302', type: 'Consultation', floor: '3rd Floor', status: 'Available' },
    { roomNumber: '401', name: 'Consultation Room 401', type: 'Consultation', floor: '4th Floor', status: 'Available' },
    { roomNumber: 'ICU-04', name: 'ICU Room 04', type: 'ICU', floor: 'Ground Floor', status: 'Occupied', currentOccupant: { name: 'Bob Smith', admittedAt: new Date('2026-04-18'), condition: 'Critical' } },
    { roomNumber: 'ER-01', name: 'Emergency Room 01', type: 'Emergency', floor: 'Ground Floor', status: 'Available' },
  ];
  const created = await Room.insertMany(roomsData);
  console.log(`✅ Seeded ${created.length} rooms`);
  return created;
};

const seedSessionsAndAppointments = async (doctors, patients, rooms) => {
  const consultRooms = rooms.filter(r => r.type === 'Consultation' && r.status === 'Available');
  const sarah = doctors.find(d => d.fullName === 'Dr. Sarah Jenkins');
  const emily = doctors.find(d => d.fullName === 'Dr. Emily Rodriguez');
  const marcus = doctors.find(d => d.fullName === 'Dr. Marcus Thorne');
  const alan = doctors.find(d => d.fullName === 'Dr. Alan Smith');
  const emilyC = doctors.find(d => d.fullName === 'Dr. Emily Chen');
  const room1 = consultRooms[0]; const room2 = consultRooms[1];
  const room3 = consultRooms[2]; const room4 = consultRooms[3];

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today); nextWeek.setDate(nextWeek.getDate() + 3);

  const sessions = await Session.insertMany([
    { doctor: sarah._id, doctorName: sarah.fullName, specialization: 'Cardiology', room: room1._id, roomNumber: room1.roomNumber, date: today, startTime: '09:00', endTime: '12:00', maxPatients: 12, currentPatients: 3, status: 'Active', sessionType: 'In-Person', createdByRole: 'admin' },
    { doctor: emily._id, doctorName: emily.fullName, specialization: 'Pediatrics', room: room2._id, roomNumber: room2.roomNumber, date: today, startTime: '14:00', endTime: '17:00', maxPatients: 10, currentPatients: 2, status: 'Upcoming', sessionType: 'In-Person', createdByRole: 'admin' },
    { doctor: marcus._id, doctorName: marcus.fullName, specialization: 'Neurology', room: room3._id, roomNumber: room3.roomNumber, date: tomorrow, startTime: '10:00', endTime: '13:00', maxPatients: 8, currentPatients: 1, status: 'Upcoming', sessionType: 'In-Person', createdByRole: 'admin' },
    { doctor: alan._id, doctorName: alan.fullName, specialization: 'Cardiology', room: room4._id, roomNumber: room4.roomNumber, date: nextWeek, startTime: '14:30', endTime: '17:30', maxPatients: 12, currentPatients: 0, status: 'Upcoming', sessionType: 'In-Person', createdByRole: 'admin' },
  ]);
  console.log(`✅ Seeded ${sessions.length} sessions`);

  const alice = patients.find(p => p.fullName === 'Alice Johnson');
  const sarahP = patients.find(p => p.fullName === 'Sarah Thompson');
  const robert = patients.find(p => p.fullName === 'Robert Wilson');
  const alex = patients.find(p => p.fullName === 'Alex Johnson');
  const amara = patients.find(p => p.fullName === 'Amara Silva');

  const appointments = await Appointment.insertMany([
    { patient: sarahP._id, patientName: sarahP.fullName, patientEmail: sarahP.email, doctor: sarah._id, doctorName: sarah.fullName, session: sessions[0]._id, department: 'Cardiology', specialization: 'Cardiology', appointmentDate: today, timeSlot: '09:30', queuePosition: 1, ticketNumber: 'C-100', status: 'Confirmed', attendanceConfirmed: true, bookingSource: 'web', createdByRole: 'patient' },
    { patient: robert._id, patientName: robert.fullName, patientEmail: robert.email, doctor: emily._id, doctorName: emily.fullName, session: sessions[1]._id, department: 'Pediatrics', specialization: 'Pediatrics', appointmentDate: today, timeSlot: '14:30', queuePosition: 1, ticketNumber: 'P-100', status: 'Pending', bookingSource: 'phone', createdByRole: 'admin' },
    { patient: alice._id, patientName: alice.fullName, patientEmail: alice.email, doctor: sarah._id, doctorName: sarah.fullName, session: sessions[0]._id, department: 'Cardiology', specialization: 'Cardiology', appointmentDate: today, timeSlot: '10:00', queuePosition: 2, ticketNumber: 'C-101', status: 'Confirmed', attendanceConfirmed: true, bookingSource: 'web', createdByRole: 'patient' },
    { patient: alex._id, patientName: alex.fullName, patientEmail: alex.email, doctor: marcus._id, doctorName: marcus.fullName, session: sessions[2]._id, department: 'Neurology', specialization: 'Neurology', appointmentDate: tomorrow, timeSlot: '10:30', queuePosition: 1, ticketNumber: 'N-100', status: 'Pending', bookingSource: 'web', createdByRole: 'patient' },
    { patient: amara._id, patientName: amara.fullName, patientEmail: amara.email, doctor: sarah._id, doctorName: sarah.fullName, session: sessions[0]._id, department: 'Cardiology', specialization: 'Cardiology', appointmentDate: today, timeSlot: '10:30', queuePosition: 3, ticketNumber: 'C-102', status: 'Pending', bookingSource: 'web', createdByRole: 'patient' },
  ]);
  console.log(`✅ Seeded ${appointments.length} appointments`);
  return { sessions, appointments };
};

const seedPrescriptions = async (doctors, patients) => {
  const sarah = doctors.find(d => d.fullName === 'Dr. Sarah Jenkins');
  const marcus = doctors.find(d => d.fullName === 'Dr. Marcus Thorne');
  const emilyC = doctors.find(d => d.fullName === 'Dr. Emily Chen');
  const alan = doctors.find(d => d.fullName === 'Dr. Alan Smith');
  const alice = patients.find(p => p.fullName === 'Alice Johnson');
  const john = patients.find(p => p.fullName === 'John Doe');
  const amara = patients.find(p => p.fullName === 'Amara Silva');
  const bob = patients.find(p => p.fullName === 'Bob Smith');

  const prescriptions = await Prescription.insertMany([
    { patient: amara._id, patientName: amara.fullName, patientId: amara.patientId, doctor: emilyC._id, doctorName: emilyC.fullName, specialization: 'Cardiology', medications: [{ name: 'Atorvastatin', dosage: '20mg', duration: '30', durationUnit: 'Days', frequency: 'Once daily (QD)', instructions: 'Take at bedtime' }], notes: 'Monitor cholesterol levels after 4 weeks.', status: 'Active', issueDate: new Date('2026-04-05'), expiryDate: new Date('2026-05-05') },
    { patient: john._id, patientName: john.fullName, patientId: john.patientId, doctor: marcus._id, doctorName: marcus.fullName, specialization: 'Neurology', medications: [{ name: 'Sumatriptan', dosage: '50mg', duration: '14', durationUnit: 'Days', frequency: 'As needed (PRN)', instructions: 'Use at first sign of migraine' }], notes: 'Avoid prolonged screen exposure.', status: 'Active', issueDate: new Date('2026-04-10'), expiryDate: new Date('2026-05-10') },
    { patient: alice._id, patientName: alice.fullName, patientId: alice.patientId, doctor: sarah._id, doctorName: sarah.fullName, specialization: 'Cardiology', medications: [{ name: 'Amoxicillin', dosage: '500mg', duration: '7', durationUnit: 'Days', frequency: 'Three times daily (TID)', instructions: 'Take with food' }, { name: 'Ibuprofen', dosage: '400mg', duration: '5', durationUnit: 'Days', frequency: 'Twice daily (BID)', instructions: 'Take after meals' }], notes: 'Complete the full course of antibiotics.', status: 'Completed', issueDate: new Date('2026-03-20'), expiryDate: new Date('2026-04-20') },
    { patient: bob._id, patientName: bob.fullName, patientId: bob.patientId, doctor: alan._id, doctorName: alan.fullName, specialization: 'Cardiology', medications: [{ name: 'Lisinopril', dosage: '10mg', duration: '30', durationUnit: 'Days', frequency: 'Once daily (QD)', instructions: 'Take in the morning with water' }], notes: 'Monitor blood pressure daily. Report any dizziness.', status: 'Active', issueDate: new Date('2026-04-15'), expiryDate: new Date('2026-05-15') },
  ]);
  console.log(`✅ Seeded ${prescriptions.length} prescriptions`);
};

const runSeed = async () => {
  try {
    await connectDB();
    await clearAll();
    await seedAdmins();
    const doctors = await seedDoctors();
    const patients = await seedPatients();
    const rooms = await seedRooms();
    await seedSessionsAndAppointments(doctors, patients, rooms);
    await seedPrescriptions(doctors, patients);
    console.log('\n🎉 All seed data inserted successfully!');
    console.log('─────────────────────────────────────────');
    console.log('🔑 Admin login:    EID: EID-0001  | Password: admin123');
    console.log('👨‍⚕️ Doctor login:   NIC: 880120-1234567 | Password: doctor123');
    console.log('🧑‍💼 Patient login:  NIC: 901125-1111111 | Password: patient123');
    console.log('─────────────────────────────────────────\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

runSeed();
