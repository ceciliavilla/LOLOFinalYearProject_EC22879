// app/signup/__tests__/ProfileScreen.test.tsx

// Mock Firebase Authentication and Firestore
jest.mock('firebase/auth', () => ({
    getAuth: () => ({
      currentUser: { uid: 'testuid', email: 'test@example.com' },
    }),
    updateEmail: jest.fn(),
    updatePassword: jest.fn(),
    signOut: jest.fn(),
    EmailAuthProvider: {
      credential: jest.fn(),
    },
    reauthenticateWithCredential: jest.fn(),
  }));
  
  jest.mock('firebase/firestore', () => ({
    getFirestore: jest.fn(() => ({})),
    doc: jest.fn(),
    getDoc: jest.fn(() => Promise.resolve({
      exists: () => true,
      data: () => ({
        userType: 'Elderly',
        name: 'Lolo',
        lastName: 'Villa',
        email: 'test@example.com',
        birthDate: { toDate: () => new Date() },
      }),
    })),
    updateDoc: jest.fn(),
    Timestamp: class {
      static fromDate(date) {
        return { toDate: () => date };
      }
    },
  }));
  
  jest.mock('../../firebaseConfig', () => ({
    firebaseApp: {},
  }));
  
  jest.mock('expo-router', () => ({
    router: {
      push: jest.fn(),
    },
  }));
  
  // Import libraries
  import { render, fireEvent, waitFor } from '@testing-library/react-native';
  import { Alert } from 'react-native';
  import { updateDoc } from 'firebase/firestore';
  import ProfileScreen from '../../app/(tabs)/ProfileScreen';
  
  describe('ProfileScreen', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    // Mock Alert.alert to auto-confirm updates
    jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
      const updateButton = buttons?.find(b => b.text === 'Update');
      if (updateButton) updateButton.onPress();
    });
  
    // Test 1: Load and display user data correctly
    it('Test 1: loads and displays user data correctly', async () => {
      const { getByDisplayValue, getByText, queryByText } = render(<ProfileScreen />);
  
      await waitFor(() => {
        expect(queryByText('Loading...')).toBeNull();
      });
  
      expect(getByDisplayValue('Lolo')).toBeTruthy();
      expect(getByDisplayValue('Villa')).toBeTruthy();
      expect(getByText('test@example.com')).toBeTruthy();
    });
  
    // Test 2: Save changes successfully
    it('Test 2: saves changes successfully', async () => {
      const { getByTestId, queryByText } = render(<ProfileScreen />);
  
      await waitFor(() => {
        expect(queryByText('Loading...')).toBeNull();
      });
  
      fireEvent.changeText(getByTestId('Name'), 'Updated Lolo');
      fireEvent.changeText(getByTestId('Current Password'), 'currentPassword123');
  
      const saveButton = getByTestId('saveButton');
      fireEvent.press(saveButton);
  
      await waitFor(() => {
        expect(updateDoc).toHaveBeenCalled();
      });
    });
  
    // Test 3: Show error if new password is too short
    it('Test 3: shows error if new password is too short', async () => {
      const { getByTestId, queryByText } = render(<ProfileScreen />);
  
      await waitFor(() => {
        expect(queryByText('Loading...')).toBeNull();
      });
  
      fireEvent.changeText(getByTestId('Current Password'), 'currentPassword123');
      fireEvent.changeText(getByTestId('New Password'), '123');
  
      fireEvent.press(getByTestId('saveButton'));
  
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('No Valid Password');
      });
    });
  
    // Test 4: Show error if passwords do not match
    it('Test 4: shows error if new password and confirm password do not match', async () => {
      const { getByTestId, queryByText } = render(<ProfileScreen />);
  
      await waitFor(() => {
        expect(queryByText('Loading...')).toBeNull();
      });
  
      fireEvent.changeText(getByTestId('Current Password'), 'currentPassword123');
      fireEvent.changeText(getByTestId('New Password'), 'password123');
      fireEvent.changeText(getByTestId('Confirm New Password'), 'differentpassword');
  
      fireEvent.press(getByTestId('saveButton'));
  
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Passwords do not match');
      });
    });
  
    // Test 5: Show error if reauthentication fails
    it('Test 5: shows error if reauthentication fails', async () => {
      const { getByTestId, queryByText } = render(<ProfileScreen />);
      const { reauthenticateWithCredential } = require('firebase/auth');
      reauthenticateWithCredential.mockRejectedValueOnce(new Error('Reauthentication failed'));
  
      await waitFor(() => {
        expect(queryByText('Loading...')).toBeNull();
      });
  
      fireEvent.changeText(getByTestId('Current Password'), 'wrongpassword');
      fireEvent.press(getByTestId('saveButton'));
  
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', expect.stringContaining('Reauthentication failed'));
      });
    });
  
    // Test 6: Show error if updateDoc fails
    it('Test 6: shows error if something fails during save', async () => {
      const { getByTestId, queryByText } = render(<ProfileScreen />);
      const { updateDoc } = require('firebase/firestore');
      updateDoc.mockRejectedValueOnce(new Error('Update failed'));
  
      await waitFor(() => {
        expect(queryByText('Loading...')).toBeNull();
      });
  
      fireEvent.changeText(getByTestId('Current Password'), 'currentPassword123');
      fireEvent.press(getByTestId('saveButton'));
  
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', expect.stringContaining('Update failed'));
      });
    });
  
    // Test 7: Log out successfully
    it('Test 7: logs out successfully when user confirms', async () => {
      const { getByText, queryByText } = render(<ProfileScreen />);
  
      await waitFor(() => {
        expect(queryByText('Loading...')).toBeNull();
      });
  
      jest.spyOn(Alert, 'alert').mockImplementationOnce((title, message, buttons) => {
        const logoutButton = buttons?.find(b => b.text === 'Log Out');
        if (logoutButton) logoutButton.onPress();
      });
  
      fireEvent.press(getByText('Log Out'));
  
      const { signOut } = require('firebase/auth');
      await waitFor(() => {
        expect(signOut).toHaveBeenCalled();
      });
  
      const { router } = require('expo-router');
      expect(router.push).toHaveBeenCalledWith('/');
    });
  
    // Test 8: Show Birth Date field for Elderly user
    it('Test 8: shows Birth Date field for Elderly user', async () => {
      const { getByText, queryByText } = render(<ProfileScreen />);
  
      await waitFor(() => {
        expect(queryByText('Loading...')).toBeNull();
      });
  
      expect(getByText('Birth Date')).toBeTruthy();
    });
  
    // Test 9: Show Speciality field for Healthcare user
    it('Test 9: shows Speciality field for Healthcare user', async () => {
      const { getDoc } = require('firebase/firestore');
      getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({
          userType: 'Healthcare',
          name: 'Dr. John',
          lastName: 'Doe',
          email: 'healthcare@example.com',
          speciality: 'Cardiology',
          birthDate: { toDate: () => new Date() },
        }),
      });
  
      const { getByText, queryByText } = render(<ProfileScreen />);
  
      await waitFor(() => {
        expect(queryByText('Loading...')).toBeNull();
      });
  
      expect(getByText('Speciality')).toBeTruthy();
    });
  
    // Test 10: Do not show Birth Date or Speciality fields for Family user
    it('Test 10: does not show Birth Date or Speciality fields for Family user', async () => {
      const { getDoc } = require('firebase/firestore');
      getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({
          userType: 'Family',
          name: 'John Family',
          lastName: 'Doe',
          email: 'family@example.com',
          birthDate: { toDate: () => new Date() },
        }),
      });
  
      const { queryByText } = render(<ProfileScreen />);
  
      await waitFor(() => {
        expect(queryByText('Loading...')).toBeNull();
      });
  
      expect(queryByText('Birth Date')).toBeNull();
      expect(queryByText('Speciality')).toBeNull();
    });
  });
  