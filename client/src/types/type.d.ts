declare type IUser = {
    _id: Types.ObjectId;
    firstName: string,
    lastName: string,
    email: string,
    photo: string,
    phone: number | string,
    gender: string,
    dateOfBirth: string,
    photo?: string,
    companyName?: string | string[],
    createdAt?: Date,
    updatedAt?: Date
}

declare type IAdmin = {
    _id: Types.ObjectId;
    firstName: string,
    lastName: string,
    email: string,
    photo: string,
    phone: number,
    gender: string,
    dateOfBirth?: string,
    photo?: string,
    companyName: string[]
}

declare type IDoctor = {
    _id: Types.ObjectId;
    firstName: string,
    lastName: string,
    email: string,
    photo: string,
    phone: number,
    gender: string,
    dateOfBirth?: string,
    photo?: string,
    companyName: string,
    availableSlots: string[],
    specialization: string[],
    degree: string[],
    department: string,
    assignedPatients: []
    appointments: []
}

declare type INurse = {
    _id: Types.ObjectId;
    firstName: string,
    lastName: string,
    email: string,
    photo: string,
    phone: number,
    gender: string,
    dateOfBirth?: string,
    photo?: string,
    companyName: string,
    assignedDoctor?: IdType,
    shiftTimings: string[],
    specialization: string[],
    degree: string[],
}

declare type IPatient = {
    _id: Types.ObjectId;
    userId: {
        firstName: string,
        lastName: string,
        email: string,
        dateOfBirth: string,
        phone: string | number,
        gender: string,
        photo: string,
    }
    height: number,
    weight: number,
    address: string,
    bloodGroup: string,
    bloodPressure: string,
    appointments: string[],
    medicalHistory: string,
    emergencyContactName: string,
    emergencyContactRelation: string,
    emergencyContactPhone: string | number,
}

declare type IAppointment = {
    _id: Types.ObjectId;
    patientId: IdType | string;
    doctorId: IdType | string;
    scheduledDate: string,
    reasoneForAppointment: string,
    cureByDoctor?: {data: string,createdAt: Date}[],
    status: "Pending" | "Completed",
    progress: number
}

// Register a new Admin
declare type ICreateAdmin = {
    _id?: Types.ObjectId;
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    gender: string,
    dateOfBirth: string,
    phone: string,
    companyName: string
}

// Login user types
declare type LoginUserParams = {
    email: string,
    password: string,
}

// Update user types
declare type UpdateUserParams = {
    firstName: string,
    lastName: string,
    email: string,
    phone: number | string,
    gender: string,
    dateOfBirth: string,
    photo?: string | null,
}

// Update Patient types
declare type UpdatePatientParams = {
    bloodGroup?: string,
    bloodPressure?: string,
    height?: number,
    weight?: number,
}

// Update Appointment Data 
declare type UpdateAppointmentData = {
    reasoneForAppointment?: string,
    cureByDoctor?: string,
    scheduledDate?: string,
    status?: "Pending" | "Completed",
    progress?: number
}

declare type IAddDoctor = {
    firstName: string,
    lastName: string,
    email: string,
    photo: string,
    phone: number,
    photo?: string,
    gender: string,
    dateOfBirth: string,
    companyName: string,
    availableSlots: string[],
    specialization: string[],
    degree: string[],
    department: string,
}

declare type IAddNurse = {
    firstName: string,
    lastName: string,
    email: string,
    photo: string,
    phone: number,
    photo?: string,
    gender: string,
    dateOfBirth: string,
    companyName: string,
    shiftTimings: string[],
    specialization: string[],
    degree: string[],
}

declare type IAddPatient = {
    firstName: string,
    lastName: string,
    email: string,
    dateOfBirth: string,
    phone: string | number,
    gender: string,
    photo: string,
    address: string,
    emergencyContactName: string,
    emergencyContactPhone: string | number,
    emergencyContactRelation: string,
    bloodGroup: string,
    bloodPressure: string,
    height: number,
    weight: number,
}

declare type IAddAppointment = {
    patientId: string,
    doctorId: string,
    reasoneForAppointment: string,
    scheduledDate: string,
}

// Task adding types
declare type AddTaskParams = {
    title: string,
    description: string,
    dueDate: string,
    status: string,
    priority: string,
    tags: string
}

// Task type
declare type Task = {
    _id?: Types.ObjectId,
    owner: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    priority: 'High' | 'Medium' | 'Low';
    dueDate: Date;
    isCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    tags?: string;
    progress: number;
}

declare type IdType = {
    _id: Types.ObjectId
}