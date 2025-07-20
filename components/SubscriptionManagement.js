import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { toast } from 'react-toastify';
import { 
  CreditCardIcon, 
  CalendarIcon,
  CheckCircleIcon,
  StarIcon,
  XCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/outline';

// Helper function to safely convert Firebase timestamp to Date
const timestampToDate = (timestamp) => {
  if (!timestamp) return null;
  
  if (timestamp instanceof Date) {
    return timestamp;
  }
  
  if (timestamp.seconds) {
    return new Date(timestamp.seconds * 1000);
  }
  
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  
  return null;
};

const SubscriptionManagement = ({ user, userData, isOwnProfile }) => {
  const [loading, setLoading] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (isOwnProfile && userData) {
      loadSubscriptionData();
    }
  }, [isOwnProfile, userData]);

  const loadSubscriptionData = async () => {
    if (!userData?.stripeCustomerId) return;
    
    try {
      setLoading(true);
      // Get subscription details from Firestore
      const premiumExpire = timestampToDate(userData.premiumExpire);
      const subscriptionId = userData.stripeSubscriptionId;
      const subscriptionWillCancel = userData.subscriptionWillCancel || false;
      
      setSubscriptionData({
        premiumExpire,
        subscriptionId,
        subscriptionWillCancel,
        isActive: premiumExpire && premiumExpire >= new Date(),
        customerId: userData.stripeCustomerId
      });
    } catch (error) {
      console.error('Error loading subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    console.log('Cancelling subscription:', subscriptionData);
    if (!subscriptionData?.subscriptionId) {
      toast.error('No active subscription found');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: subscriptionData.subscriptionId,
          userId: user.uid
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('Subscription cancelled successfully. You will retain premium access until the end of your current billing period.');
        setSubscriptionData(prev => ({
          ...prev,
          subscriptionWillCancel: true
        }));
        setShowCancelModal(false);
        // Also update the userData if available to reflect the change
        if (userData) {
          userData.subscriptionWillCancel = true;
        }
      } else {
        toast.error(result.message || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleReactivateSubscription = async () => {
    console.log('Reactivating subscription:', subscriptionData);
    if (!subscriptionData?.subscriptionId) {
      toast.error('No subscription found to reactivate');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/reactivate-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: subscriptionData.subscriptionId,
          userId: user.uid
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('Subscription reactivated successfully. Auto-renewal has been enabled.');
        setSubscriptionData(prev => ({
          ...prev,
          subscriptionWillCancel: false
        }));
        // Also update the userData if available to reflect the change
        if (userData) {
          userData.subscriptionWillCancel = false;
        }
      } else {
        toast.error(result.message || 'Failed to reactivate subscription');
      }
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      toast.error('Failed to reactivate subscription');
    } finally {
      setLoading(false);
    }
  };

  if (!isOwnProfile || !userData?.isInstructor) {
    return null;
  }

  const hasValidPremium = subscriptionData?.isActive;
  const premiumExpire = subscriptionData?.premiumExpire;
  const subscriptionWillCancel = subscriptionData?.subscriptionWillCancel;
  const daysUntilExpiry = premiumExpire ? Math.ceil((premiumExpire - new Date()) / (1000 * 60 * 60 * 24)) : 0;
  const isExpiringSoon = daysUntilExpiry <= 7 && daysUntilExpiry > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${hasValidPremium ? 'bg-yellow-100' : 'bg-gray-100'}`}>
            <StarIcon className={`w-6 h-6 ${hasValidPremium ? 'text-yellow-600' : 'text-gray-500'}`} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Premium Subscription</h2>
            <p className="text-sm text-gray-600">Manage your premium automation features</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E63F2B]"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Subscription Status */}
          {hasValidPremium ? (
            <div className={`rounded-lg p-4 border-l-4 ${
              subscriptionWillCancel 
                ? 'bg-orange-50 border-orange-400'
                : isExpiringSoon 
                  ? 'bg-orange-50 border-orange-400' 
                  : 'bg-green-50 border-green-400'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${
                    subscriptionWillCancel 
                      ? 'bg-orange-100'
                      : isExpiringSoon ? 'bg-orange-100' : 'bg-green-100'
                  }`}>
                    {subscriptionWillCancel || isExpiringSoon ? (
                      <ExclamationCircleIcon className="w-5 h-5 text-orange-600" />
                    ) : (
                      <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${
                      subscriptionWillCancel || isExpiringSoon ? 'text-orange-900' : 'text-green-900'
                    }`}>
                      {subscriptionWillCancel 
                        ? 'Auto-Renewal Disabled' 
                        : isExpiringSoon 
                          ? 'Premium Expiring Soon' 
                          : 'Premium Active'
                      }
                    </h3>
                    <p className={`text-sm mt-1 ${
                      subscriptionWillCancel || isExpiringSoon ? 'text-orange-700' : 'text-green-700'
                    }`}>
                      {subscriptionWillCancel
                        ? `Your subscription expires on ${premiumExpire.toLocaleDateString()}`
                        : isExpiringSoon 
                          ? `Your subscription expires in ${daysUntilExpiry} day${daysUntilExpiry === 1 ? '' : 's'}`
                          : `Active until ${premiumExpire.toLocaleDateString()}`
                      }
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <CreditCardIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">$5.00 CAD/month</span>
                      <span className="text-xs text-gray-500">
                        {subscriptionWillCancel 
                          ? '• Auto-renewal disabled' 
                          : '• Auto-renews monthly'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg p-4 border-l-4 bg-gray-50 border-gray-400">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-full bg-gray-100">
                  <XCircleIcon className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">No Active Subscription</h3>
                  <p className="text-sm text-gray-700 mt-1">
                    {premiumExpire 
                      ? `Your premium subscription expired on ${premiumExpire.toLocaleDateString()}`
                      : 'You don\'t have an active premium subscription'
                    }
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Upgrade to premium to access advanced automation features.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Premium Features List */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Premium Features Include:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                'New booking confirmations',
                'Class reschedule notifications', 
                'Cancellation notifications',
                'Thank you messages',
                'Win-back campaigns',
                'Welcome new student emails',
                'Reminder to rebook automation',
                'Advanced engagement tools'
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircleIcon className={`w-4 h-4 flex-shrink-0 ${
                    hasValidPremium ? 'text-green-600' : 'text-gray-400'
                  }`} />
                  <span className={`text-sm ${
                    hasValidPremium ? 'text-gray-700' : 'text-gray-500'
                  }`}>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
            {hasValidPremium ? (
              <>
                <a
                  href="/automations"
                  className="flex-1 bg-[#E63F2B] text-white px-6 py-3 rounded-lg font-medium text-center hover:bg-[#D63825] transition-colors"
                >
                  Manage Automations
                </a>
                {subscriptionWillCancel ? (
                  <div className="flex flex-col gap-2">
                    <div className="bg-blue-50 border border-blue-200 text-blue-700 px-6 py-2 rounded-lg text-sm text-center">
                      Subscription will not renew after {premiumExpire?.toLocaleDateString()}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors border"
                  >
                    Cancel Subscription
                  </button>
                )}
              </>
            ) : (
              <a
                href="/automations"
                className="w-full bg-gradient-to-r from-[#E63F2B] to-[#FF6B5A] text-white px-6 py-3 rounded-lg font-medium text-center hover:from-[#D63825] hover:to-[#E55B4A] transition-all"
              >
                Upgrade to Premium - $5.00/month
              </a>
            )}
          </div>
        </div>
      )}

      {/* Cancel Subscription Modal */}
      {showCancelModal && !subscriptionWillCancel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <ExclamationCircleIcon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Cancel Subscription</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to cancel your premium subscription?
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> You'll retain premium access until {premiumExpire?.toLocaleDateString()}, 
                  but your subscription won't renew after that date.
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;
