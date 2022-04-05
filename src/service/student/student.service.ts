import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateStudentDto } from 'src/dto/create-student.dto';
import { IStudent } from 'src/interface/student.interface';
import { Model } from "mongoose";
import { UpdateStudentDto } from 'src/dto/update-student.dto';

@Injectable()
export class StudentService {
    constructor(@InjectModel('Student') private studentModel: Model<IStudent>) { }

    async createStudent(createStudentDto: CreateStudentDto): Promise<IStudent> {
        const newStudent = await new this.studentModel(createStudentDto);
        return newStudent.save();
    }

    async updateStudent(studentId: string, updateStudentDto: UpdateStudentDto): Promise<IStudent> {
        const existingStudent = await this.studentModel.findByIdAndUpdate(studentId, updateStudentDto, { new: true });
        if (!existingStudent) {
            throw new NotFoundException(`Student #${studentId} not found`);
        }
        return existingStudent;
    }

    async getAllStudents(): Promise<IStudent[]> {
        const studentData = await this.studentModel.find();
        if (!studentData || studentData.length == 0) {
            throw new NotFoundException('Students data not found!');
        }
        return studentData;
    }

    async getStudent(studentId: string): Promise<IStudent> {
        const existingStudent = await this.studentModel.findById(studentId).exec();
        if (!existingStudent) {
            throw new NotFoundException(`Student #${studentId} not found`);
        }
        return existingStudent;
    }

    async deleteStudent(studentId: string): Promise<IStudent> {
        const deletedStudent = await this.studentModel.findByIdAndDelete(studentId);
        if (!deletedStudent) {
            throw new NotFoundException(`Student #${studentId} not found`);
        }
        return deletedStudent;
    }
}
