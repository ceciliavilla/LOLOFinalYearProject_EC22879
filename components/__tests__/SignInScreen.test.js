// app/signup/__tests__/SignInScreen.test.js

// Mock Firebase Authentication and Firestore
jest.mock('firebase/auth', () => ({
    signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { uid: 'testuid' } })),
  }));

jest.mock('firebase/firestore', () => ({
    doc: jest.fn(),
    getDoc: jest.fn(() => Promise.resolve({ exists: () => true, data: () => ({ userType: 'Elderly' }) })),
  }));
  
// Mock Firebase Configuration
jest.mock('../../firebaseConfig', () => ({
    auth: {},
    db: {},
  }));
  

// Mock expo-router correctly
jest.mock('expo-router', () => {
    const routerMock = {
      replace: jest.fn(),
      push: jest.fn(),
    };
    return {
      useRouter: () => routerMock,
      routerMock: routerMock, 
    };
  });
  
  
// Import Testing Tools
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import SignInScreen from '../../app/(auth)/SignInScreen';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDoc } from 'firebase/firestore';
import { routerMock } from 'expo-router';

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// Start Testing Sign In Screen
 describe('SignInScreen', () => {

    // Clear all mocks before each test 
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    // Test 1: Successful Sign In
    it('signs in successfully and redirects Elderly user', async () => {
      const { getByPlaceholderText, getByTestId, getByText } = render(<SignInScreen />);
  
      // Fill fields
      fireEvent.changeText(getByPlaceholderText('Email'), 'elderly@example.com');
      fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
  
      // Press Sign In button
      const signInButton = getByTestId('signInButton');
      fireEvent.press(signInButton);
  
      
      await waitFor(() => {
        // Verify Firebase call
        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
          expect.anything(), 
          'elderly@example.com',
          'password123'
        );
  
        // Verify Firestore call
        expect(getDoc).toHaveBeenCalled();
      });
    });

    // Test 2: Shows error alert when invalid credentials
    it('shows error if credentials are wrong', async () => {
  
      // Make signInWithEmailAndPassword throw an error
      signInWithEmailAndPassword.mockRejectedValueOnce(new Error('Invalid credentials'));

        const { getByPlaceholderText, getByTestId } = render(<SignInScreen />);
  
        fireEvent.changeText(getByTestId('Email'), 'invalidemail@example.com');
        fireEvent.changeText(getByTestId('Password'), 'wrongpassword');
  
        const signInButton = getByTestId('signInButton');
        fireEvent.press(signInButton);

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Error',
            expect.stringContaining('Invalid credentials')
            );
        });
    });

    // Test 3: Shows error if user does not exist in Firestore
   /* it('shows error if user not found in Firestore', async () => {
    
    // Mock getDoc to simulate user not found
    getDoc.mockResolvedValueOnce({ exists: () => false });
  
    const { getByPlaceholderText, getByTestId } = render(<SignInScreen />);
  
    fireEvent.changeText(getByTestId('Email'), 'notfound@example.com');
    fireEvent.changeText(getByTestId('Password'), 'password123');
  
    const signInButton = getByTestId('signInButton');
    fireEvent.press(signInButton);
  
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error',
        expect.stringContaining('User not found')
      );
    });
  });

  // Test 4: Shows error if userType from Firestore is not recognized
  /*it('shows error if userType is not recognized', async () => {

    // Mock getDoc to simulate unknown userType
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ userType: 'NonType' }), 
    });
  
    const { getByPlaceholderText, getByTestId } = render(<SignInScreen />);
  
    fireEvent.changeText(getByTestId('Email'), 'unknown@example.com');
    fireEvent.changeText(getByTestId('Password'), 'password123');
  
    const signInButton = getByTestId('signInButton');
    fireEvent.press(signInButton);
  
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error',
        expect.stringContaining('User type not recognized')
      );
    });
  });*/

  // Test 5: Redirects correctly if userType is Family
  it('redirects Family user to FamilyScreen', async () => {

    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ userType: 'Family' }),
    });
  
    const { getByPlaceholderText, getByTestId } = render(<SignInScreen />);
  
    // Fill the fields
    fireEvent.changeText(getByPlaceholderText('Email'), 'family@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
  
  
    const signInButton = getByTestId('signInButton');
    fireEvent.press(signInButton);
  
    await waitFor(() => {
      expect(routerMock.replace).toHaveBeenCalledWith('/(tabs)/FamilyScreen');
    });
  });
  
  // Test 6: Redirects correctly if userType is Healthcare
  it('redirects Healthcare user to HealthcareScreen', async () => {
    
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ userType: 'Healthcare' }),
    });
  
    const { getByPlaceholderText, getByTestId } = render(<SignInScreen />);
  
    // Fill the fields
    fireEvent.changeText(getByPlaceholderText('Email'), 'healthcare@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
  

    const signInButton = getByTestId('signInButton');
    fireEvent.press(signInButton);
  

    await waitFor(() => {
      expect(routerMock.replace).toHaveBeenCalledWith('/(tabs)/HealthcareScreen');
    });
  });
    //Test 7: Redirects correctly if userType is Elderly
    it('redirects Elderly user to ElderlyScreen', async () => {
        // Mock getDoc to simulate Elderly user
        getDoc.mockResolvedValueOnce({
          exists: () => true,
          data: () => ({ userType: 'Elderly' }),
        });
      
        const { getByPlaceholderText, getByTestId } = render(<SignInScreen />);
      
        fireEvent.changeText(getByPlaceholderText('Email'), 'elderly@example.com');
        fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
      
        const signInButton = getByTestId('signInButton');
        fireEvent.press(signInButton);
      
        await waitFor(() => {
          expect(routerMock.replace).toHaveBeenCalledWith('/(tabs)/ElderlyScreen');
        });
      });

  // Test 8: Shows error if email or password fields are empty
  it('shows error if email or password are empty', async () => {
    const { getByTestId } = render(<SignInScreen />);
  
    const signInButton = getByTestId('signInButton');
    fireEvent.press(signInButton);
  
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error',
        expect.stringContaining('Please fill in all fields')
      );
    });
  
    // Confirm that No firebase call was made
    expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
  }); 
});
  