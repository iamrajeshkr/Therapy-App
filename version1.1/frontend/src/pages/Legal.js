import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './Legal.css';

// Content for each legal section
const legalContent = {
  privacy: {
    title: 'Privacy Policy',
    lastUpdated: 'Last Updated: July 2023',
    content: [
      {
        heading: '1. Introduction',
        text: 'At Mindfulness Therapy, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application. Please read this policy carefully. If you disagree with its terms, please discontinue use of our application.'
      },
      {
        heading: '2. Information We Collect',
        text: 'We collect information in the following ways:\n\n• Personal Data: All your data, including journal entries, therapy chat sessions, and mood logs, are stored locally on your device and are not transmitted to our servers.\n\n• Usage Data: We may collect anonymous usage statistics to improve the application, including feature usage and general interaction patterns. This data contains no personally identifiable information.'
      },
      {
        heading: '3. How We Use Your Information',
        text: 'We use your information to provide, maintain, and improve our services, including:\n\n• Providing the core functionality of the application (journaling, mood tracking, therapy chat sessions)\n\n• Analyzing usage patterns to improve user experience\n\n• Developing new features based on user needs'
      },
      {
        heading: '4. Local Storage',
        text: 'This application stores all your data locally on your device. We prioritize your privacy by ensuring that your personal information, therapy sessions, journal entries, and mood logs remain on your device. No data is sent to external servers as part of the core application functionality.'
      },
      {
        heading: '5. Data Security',
        text: 'We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.'
      },
      {
        heading: '6. Children\'s Privacy',
        text: 'Our application is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.'
      },
      {
        heading: '7. Changes to This Privacy Policy',
        text: 'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.'
      },
      {
        heading: '8. Contact Us',
        text: 'If you have any questions about this Privacy Policy, please contact us at privacy@mindfulnesstherapy.app'
      }
    ]
  },
  terms: {
    title: 'Terms of Use',
    lastUpdated: 'Last Updated: July 2023',
    content: [
      {
        heading: '1. Acceptance of Terms',
        text: 'By accessing or using the Mindfulness Therapy application, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this application.'
      },
      {
        heading: '2. Use License',
        text: 'Permission is granted to use the Mindfulness Therapy application for personal, non-commercial use only. This use license is subject to the following restrictions:\n\n• You may not modify, copy, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, transfer, or sell any information obtained from the application.\n\n• You may not attempt to decompile or reverse engineer any software contained in the application.\n\n• Your license to use the application will terminate if you violate any of these restrictions.'
      },
      {
        heading: '3. Disclaimer',
        text: 'The materials on the Mindfulness Therapy application are provided on an "as is" basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.'
      },
      {
        heading: '4. Limitations',
        text: 'In no event shall Mindfulness Therapy or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the application, even if we or an authorized representative has been notified orally or in writing of the possibility of such damage.'
      },
      {
        heading: '5. Accuracy of Materials',
        text: 'The materials appearing in the Mindfulness Therapy application could include technical, typographical, or photographic errors. We do not warrant that any of the materials on the application are accurate, complete, or current.'
      },
      {
        heading: '6. Links',
        text: 'We have not reviewed all of the sites linked to our application and are not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us. Use of any such linked website is at the user\'s own risk.'
      },
      {
        heading: '7. Modifications',
        text: 'We may revise these terms of use for our application at any time without notice. By using this application, you agree to be bound by the current version of these terms of service.'
      },
      {
        heading: '8. Governing Law',
        text: 'These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.'
      }
    ]
  },
  disclaimer: {
    title: 'Medical Disclaimer',
    lastUpdated: 'Last Updated: July 2023',
    content: [
      {
        heading: '1. Not a Substitute for Professional Medical Advice',
        text: 'The Mindfulness Therapy application ("the App") is designed to provide general information and for educational purposes only. It is not intended to substitute professional medical advice, diagnosis, or treatment. Always seek the advice of your physician, psychologist, or other qualified health provider with any questions you may have regarding a medical or mental health condition.'
      },
      {
        heading: '2. AI Therapy Limitations',
        text: 'The artificial intelligence chatbot featured in the App is not a licensed therapist or healthcare professional. The responses generated are based on patterns and information from its training data and should not be considered medical advice. The AI has not undergone formal training in psychology, psychiatry, or any other mental health discipline and cannot diagnose or treat clinical conditions.'
      },
      {
        heading: '3. Emergency Situations',
        text: 'The App is not designed to address emergency situations. If you are experiencing a mental health crisis, having thoughts of harming yourself or others, or require immediate medical attention, please contact emergency services (dial 911 in the US) or a crisis helpline immediately, or go to your nearest emergency room.'
      },
      {
        heading: '4. Privacy Considerations',
        text: 'While the App is designed to maintain your privacy with local storage of data, you should be aware that no security system is impenetrable. We recommend not sharing highly sensitive personal information within the App that you would not want potentially exposed.'
      },
      {
        heading: '5. User Responsibility',
        text: 'Users are solely responsible for how they use the information provided by the App. You understand and agree that the developer of the App is not liable for any adverse effects or outcomes resulting from your use of or reliance on the information provided.'
      },
      {
        heading: '6. Research and Evidence Base',
        text: 'The mindfulness techniques, suggestions, and exercises provided within the App are generally based on established practices in the field, but may not be supported by conclusive scientific evidence in all cases. Results may vary between individuals.'
      },
      {
        heading: '7. No Therapeutic Relationship',
        text: 'Use of the App does not establish a doctor-patient relationship, therapist-client relationship, or any other professional healthcare relationship.'
      },
      {
        heading: '8. Indemnification',
        text: 'By using the App, you agree to indemnify and hold harmless the developers, owners, and any affiliated parties from any claims, damages, or losses resulting from your use of the App.'
      }
    ]
  }
};

const Legal = ({ type }) => {
  // If type is not provided through props, try to get it from URL params
  const params = useParams();
  const pageType = type || params.type || 'disclaimer';
  const content = legalContent[pageType] || legalContent.disclaimer;
  
  return (
    <div className="legal-page">
      <div className="container">
        <div className="legal-container">
          <header className="legal-header">
            <h1>{content.title}</h1>
            <p className="last-updated">{content.lastUpdated}</p>
          </header>
          
          <div className="legal-content">
            {content.content.map((section, index) => (
              <section key={index} className="legal-section">
                <h2>{section.heading}</h2>
                <p dangerouslySetInnerHTML={{ __html: section.text.replace(/\n\n/g, '<br><br>') }}></p>
              </section>
            ))}
          </div>
          
          <div className="legal-footer">
            <p>For any questions regarding these policies, please contact us.</p>
            <div className="legal-nav">
              <Link to="/" className="btn btn-primary">Return to Home</Link>
              <div className="legal-links">
                <Link to="/privacy" className={pageType === 'privacy' ? 'active' : ''}>Privacy Policy</Link>
                <Link to="/terms" className={pageType === 'terms' ? 'active' : ''}>Terms of Use</Link>
                <Link to="/disclaimer" className={pageType === 'disclaimer' ? 'active' : ''}>Medical Disclaimer</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legal; 