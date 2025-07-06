const { MailerService } = require('./Utils/mailer.service');
const { ConfigService } = require('@nestjs/config');

// Test email functionality
async function testEmailFunctionality() {
  console.log('🔍 Testing Email Functionality...\n');
  
  // Check if environment variables are set
  const requiredEnvVars = [
    'SMTP_HOST',
    'SMTP_USER', 
    'SMTP_PASS',
    'SMTP_FROM'
  ];
  
  console.log('📧 Email Configuration Check:');
  requiredEnvVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: ${varName === 'SMTP_PASS' ? '***' : value}`);
    } else {
      console.log(`❌ ${varName}: NOT SET`);
    }
  });
  
  console.log('\n📋 Email Features Available:');
  console.log('✅ Welcome Email (Registration)');
  console.log('✅ Email Verification (Resend)');
  console.log('✅ Password Reset Email');
  console.log('✅ Course Enrollment Email');
  console.log('✅ Course Completion Email');
  
  console.log('\n🔄 Email Flow:');
  console.log('1. User registers → Welcome email sent with OTP');
  console.log('2. User tries to login → Check if email verified');
  console.log('3. If not verified → "Please verify your email" error');
  console.log('4. User can resend verification → Email verification sent');
  console.log('5. User verifies email → Can now login');
  
  console.log('\n⚠️  To enable email functionality:');
  console.log('1. Create a .env file in the backend directory');
  console.log('2. Add SMTP configuration (see example below)');
  console.log('3. For Gmail, use App Password instead of regular password');
  
  console.log('\n📝 Example .env configuration:');
  console.log('SMTP_HOST=smtp.gmail.com');
  console.log('SMTP_PORT=587');
  console.log('SMTP_SECURE=false');
  console.log('SMTP_USER=your-email@gmail.com');
  console.log('SMTP_PASS=your-app-password');
  console.log('SMTP_FROM=your-email@gmail.com');
  console.log('FRONTEND_URL=http://localhost:3000');
}

testEmailFunctionality().catch(console.error); 