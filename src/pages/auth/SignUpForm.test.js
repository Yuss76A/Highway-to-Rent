import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import SignUpForm from './SignUpForm';
import axios from 'axios';
import { UserContext } from '../../contexts/UserContext';
import { MemoryRouter } from 'react-router-dom';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

jest.mock('axios', () => ({
  post: jest.fn().mockImplementation(() => 
    Promise.resolve({
      data: {
        token: 'fake-token',
        user: { id: 1, email: 'test@example.com', name: 'Test User' }
      }
    })
  )
}));

describe('SignUpForm', () => {
  const mockSetUser = jest.fn();
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    jest.clearAllMocks();
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  const renderComponent = async () => {
    await act(async () => {
      const root = createRoot(container);
      root.render(
        <UserContext.Provider value={{ setUser: mockSetUser }}>
          <MemoryRouter>
            <SignUpForm />
          </MemoryRouter>
        </UserContext.Provider>
      );
    });
  };

  const fillAndSubmitForm = async () => {
    const nameInput = container.querySelector('[placeholder="Full name"]');
    const emailInput = container.querySelector('[placeholder="Email"]');
    const passwordInput = container.querySelector('[placeholder="Password"]');
    const confirmInput = container.querySelector('[placeholder="Confirm password"]');
    const submitButton = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent.includes('Sign Up'));

    await act(async () => {
      const setValue = (input, value) => {
        Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        ).set.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      };

      setValue(nameInput, 'Test User');
      setValue(emailInput, 'test@example.com');
      setValue(passwordInput, 'password123');
      setValue(confirmInput, 'password123');
    });

    await act(async () => {
      submitButton.click();
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });
  };

  test('submits form with correct payload and headers', async () => {
    await renderComponent();
    await fillAndSubmitForm();

    expect(axios.post).toHaveBeenCalled();

    expect(axios.post).toHaveBeenCalledWith(
      'https://carbookingbackend-df57468af270.herokuapp.com/carbooking/register/',
      {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      }
    );

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/register/'),
      {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      }
    );
  });
});
