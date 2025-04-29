// components/__tests__/RemindersScreenTest.js

// Mocks
jest.mock('firebase/firestore', () => ({
    collection: jest.fn(),
    addDoc: jest.fn(() => Promise.resolve({ id: 'mockReminderId' })),
    setDoc: jest.fn(() => Promise.resolve()),
    doc: jest.fn(),
  }));
  
  jest.mock('expo-router', () => ({
    useRouter: () => ({
      back: jest.fn(),
    }),
    useLocalSearchParams: () => ({
      elderlyId: null,
    }),
  }));
  
  jest.mock('expo-notifications', () => ({
    requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
    scheduleNotificationAsync: jest.fn(() => Promise.resolve()),
  }));
  
  jest.mock('../../firebaseConfig', () => ({
    db: {},
    auth: {
      currentUser: {
        uid: 'mockedUserId',
      },
    },
  }));
  
  // Import
  import { render, fireEvent, waitFor } from '@testing-library/react-native';
  import Reminders from '../../app/RemindersScreen'; 
  import { Alert } from 'react-native';
  import { addDoc, setDoc } from 'firebase/firestore';
  
  // Start Test
  describe('RemindersScreen Integration', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('creates and saves a reminder successfully', async () => {
      jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  
      const { getByPlaceholderText, getByText, getByTestId } = render(<Reminders />);
  
      fireEvent.changeText(getByPlaceholderText('Reminder Title'), 'Test Reminder');
  
      fireEvent.press(getByText('Choose Date'));
      fireEvent(getByTestId('datePicker'), 'onConfirm', new Date('2025-05-01T10:00:00Z'));
  
      fireEvent.press(getByText('Choose Time'));
      fireEvent(getByTestId('timePicker'), 'onConfirm', new Date('2025-05-01T10:00:00Z'));
  
      fireEvent.press(getByTestId('SaveButton'));
  
      await waitFor(() => {
        expect(addDoc).toHaveBeenCalled();
        expect(setDoc).toHaveBeenCalled();
        expect(Alert.alert).toHaveBeenCalledWith(
          'Success',
          'Reminder created successfully!'
        );
      });
    });
  });
  