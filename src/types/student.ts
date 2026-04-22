export type Student = {
  id: string
  first_name: string
  last_name: string
  email: string
  course: string
  year_level: number
  created_at: string
  updated_at: string
}

export type StudentFormState = {
  first_name: string
  last_name: string
  email: string
  course: string
  year_level: string
}

export const emptyStudentForm: StudentFormState = {
  first_name: '',
  last_name: '',
  email: '',
  course: '',
  year_level: '1',
}
