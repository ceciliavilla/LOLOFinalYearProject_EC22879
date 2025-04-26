// src/utils/signupUtils.test.js

/*import { validateSignUp } from './signupUtils';


describe('Sign Up Validation', () => {
  test('fails when fields are empty', () => {
    expect(validateSignUp('', '', '', '')).toBe('All fields are required');
  });

  test('fails when email is invalid', () => {
    expect(validateSignUp('invalidemail', '123', '123', 'Ceci')).toBe('Invalid email');
  });

  test('fails when passwords do not match', () => {
    expect(validateSignUp('test@mail.com', '1234', 'abcd', 'Ceci')).toBe('Passwords do not match');
  });

  test('passes when all fields are correct', () => {
    expect(validateSignUp('test@mail.com', '1234', '1234', 'Ceci')).toBe('OK');
  });
});
// signupUtils.test.ts
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignUpScreen from '../../app/(auth)/SignUpScreen'; // ajusta la ruta si es distinta
import { Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc } from 'firebase/firestore';

// 📦 Mocks
jest.mock('firebase/auth', () => ({
  getAuth: () => ({}),
  createUserWithEmailAndPassword: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: () => ({}),
  doc: jest.fn(),
  setDoc: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
  }),
}));

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

describe('SignUpScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registers successfully with valid input', async () => {
    createUserWithEmailAndPassword.mockResolvedValue({
      user: { uid: 'testUID' },
    });
    setDoc.mockResolvedValue();

    const { getByTestId, getByPlaceholderText } = render(<SignUpScreen />);

    fireEvent.changeText(getByTestId('emailInput'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), '123456');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), '123456');
    fireEvent.changeText(getByPlaceholderText('Name'), 'Ceci');
    fireEvent.changeText(getByPlaceholderText('Last Name'), 'Villa');

    // Simula un botón que en tu pantalla abre el DatePicker o establece la fecha automáticamente
    // Si es complejo, puedes forzar en el código de SignUp que haya un `birthDate` por defecto para testing

    fireEvent.press(getByTestId('signUpButton'));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(), // auth
        'test@example.com',
        '123456'
      );
      expect(setDoc).toHaveBeenCalled();
    });
  });
});*/
