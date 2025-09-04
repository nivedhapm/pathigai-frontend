import React from 'react';

const PasswordStrengthIndicator = ({ password }) => {
  const calculateStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: '#ccc' };
    
    let score = 0;
    const checks = {
      length: pwd.length >= 8,
      lowercase: /[a-z]/.test(pwd),
      uppercase: /[A-Z]/.test(pwd),
      numbers: /\d/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    };
    
    // Calculate score based on criteria met
    Object.values(checks).forEach(check => {
      if (check) score++;
    });
    
    // Length bonus
    if (pwd.length >= 12) score += 1;
    
    // Determine strength level
    if (score <= 2) {
      return { score, label: 'Weak', color: '#ff4d4f' };
    } else if (score <= 4) {
      return { score, label: 'Medium', color: '#faad14' };
    } else {
      return { score, label: 'Strong', color: '#52c41a' };
    }
  };

  const strength = calculateStrength(password);
  const progressWidth = Math.min((strength.score / 5) * 100, 100);

  if (!password) return null;

  return (
    <div style={{ marginBottom: '15px' }}>
      <div style={{
        width: '100%',
        height: '4px',
        backgroundColor: '#f0f0f0',
        borderRadius: '2px',
        overflow: 'hidden',
        marginBottom: '5px'
      }}>
        <div
          style={{
            width: `${progressWidth}%`,
            height: '100%',
            backgroundColor: strength.color,
            transition: 'all 0.3s ease'
          }}
        />
      </div>
      <div style={{
        fontSize: '12px',
        color: strength.color,
        fontWeight: '500'
      }}>
        Password strength: {strength.label}
      </div>
      
      {password && strength.score < 5 && (
        <div style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>
          {!password.match(/[a-z]/) && <div>• Add lowercase letters</div>}
          {!password.match(/[A-Z]/) && <div>• Add uppercase letters</div>}
          {!password.match(/\d/) && <div>• Add numbers</div>}
          {!password.match(/[!@#$%^&*(),.?":{}|<>]/) && <div>• Add special characters</div>}
          {password.length < 8 && <div>• At least 8 characters</div>}
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;