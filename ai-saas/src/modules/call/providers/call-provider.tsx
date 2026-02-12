'use client';

import {
  createContext,
  useContext,
  useCallback,
  useState,
  type ReactNode,
} from 'react';
import { useCall } from '@stream-io/video-react-sdk';

interface CallContextValue {
  leaveCall: () => Promise<void>;
  isLeavingCall: boolean;
}

const CallContext = createContext<CallContextValue | null>(null);

export const useCallContext = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCallContext must be used within a CallProvider');
  }
  return context;
};

interface CallProviderProps {
  children: ReactNode;
}

export const CallProvider = ({ children }: CallProviderProps) => {
  const call = useCall();
  const [isLeavingCall, setIsLeavingCall] = useState(false);

  const leaveCall = useCallback(async () => {
    if (!call) return;
    try {
      setIsLeavingCall(true);
      await call.leave();
    } catch (error) {
      console.error('Error leaving call:', error);
    } finally {
      setIsLeavingCall(false);
    }
  }, [call]);

  return (
    <CallContext.Provider value={{ leaveCall, isLeavingCall }}>
      {children}
    </CallContext.Provider>
  );
};
