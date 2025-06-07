import React, { useState } from 'react';
import { Shield, X, ExternalLink } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 bg-gray-600 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition-colors duration-200 text-sm flex items-center gap-2"
        title="Privacy Policy"
      >
        <Shield className="w-4 h-4" />
        <span className="ml-[40px]">Privacy</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Privacy Policy</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="px-6 py-4 space-y-6 text-gray-700">
              <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
              
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Information We Collect</h3>
                <p>BookyHub is a client-side application that stores your bookmark data locally in your browser. We do not collect, store, or transmit your personal bookmark data to our servers.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Local Storage</h3>
                <p>Your bookmarks and folders are stored locally in your browser's localStorage. This data remains on your device and is not shared with us or third parties through our application.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Cookies and Tracking</h3>
                <p>We use Google AdSense to display advertisements. Google AdSense may use cookies and similar technologies to provide personalized ads based on your interests. You can manage your ad preferences through Google's Ad Settings.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Third-Party Services</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Google AdSense:</strong> We use Google AdSense to display advertisements. Google's privacy policy applies to their services.</li>
                  <li><strong>Analytics:</strong> We may use analytics services to understand how our application is used, without collecting personal information.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">5. Data Security</h3>
                <p>Since your data is stored locally on your device, the security of your bookmark data depends on your device's security measures. We recommend keeping your browser and device updated.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">6. Children's Privacy</h3>
                <p>Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">7. Changes to Privacy Policy</h3>
                <p>We may update this privacy policy from time to time. We will notify users of any changes by posting the new privacy policy on this page.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">8. Contact Information</h3>
                <p>If you have any questions about this privacy policy, please contact us through our website.</p>
              </section>

              <section className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  External Links
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a 
                      href="https://policies.google.com/privacy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Google Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://support.google.com/adsense/answer/113771" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Google AdSense Privacy & Terms
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://adssettings.google.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Google Ad Settings
                    </a>
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PrivacyPolicy; 