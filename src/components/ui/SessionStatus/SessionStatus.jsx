import { useState, useEffect } from 'react';
import authService from '../../../shared/services/authService';

const SessionStatus = ({ show = false }) => {
  const [tokenInfo, setTokenInfo] = useState(null);

  useEffect(() => {
    if (!show) return;

    const updateTokenInfo = () => {
      const token = authService.getAuthToken();
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Date.now() / 1000;
          const expirationTime = payload.exp;
          const timeUntilExpiration = Math.max(0, expirationTime - currentTime);

          setTokenInfo({
            isValid: timeUntilExpiration > 0,
            expiresAt: new Date(expirationTime * 1000).toLocaleString(),
            timeUntilExpiration: Math.floor(timeUntilExpiration / 60), // minutes
            nearExpiration: timeUntilExpiration <= 7200 // within 2 hours
          });
        } catch (error) {
          setTokenInfo({ error: 'Invalid token' });
        }
      } else {
        setTokenInfo({ error: 'No token found' });
      }
    };

    updateTokenInfo();
    const interval = setInterval(updateTokenInfo, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [show]);

  if (!show || !tokenInfo) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '70px',
      right: '10px',
      background: tokenInfo.nearExpiration ? '#fff3cd' : '#d1ecf1',
      border: `1px solid ${tokenInfo.nearExpiration ? '#ffeaa7' : '#bee5eb'}`,
      borderRadius: '4px',
      padding: '8px 12px',
      fontSize: '12px',
      zIndex: 10000,
      maxWidth: '250px'
    }}>
      <div><strong>Session Status</strong></div>
      {tokenInfo.error ? (
        <div style={{ color: 'red' }}>{tokenInfo.error}</div>
      ) : (
        <>
          <div>Expires: {tokenInfo.expiresAt}</div>
          <div>Time left: {tokenInfo.timeUntilExpiration} minutes</div>
          {tokenInfo.nearExpiration && (
            <div style={{ color: '#856404' }}>⚠️ Will refresh soon</div>
          )}
        </>
      )}
    </div>
  );
};

export default SessionStatus;