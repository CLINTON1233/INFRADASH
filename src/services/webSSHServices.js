// services/websshService.js
import { API_ENDPOINTS } from '../../config/api';

export class WebSSHService {
  // Cek apakah user sudah login di portal
  static async checkPortalAuth() {
    try {
      const response = await fetch(API_ENDPOINTS.VERIFY_SESSION, {
        method: 'POST',
        credentials: 'include' // untuk mengirim cookies/session
      });
      
      const data = await response.json();
      return data.valid === true;
    } catch (error) {
      console.error('Error checking portal auth:', error);
      return false;
    }
  }

  // Generate token untuk akses WebSSH
  static async generateWebSSHToken() {
    try {
      const response = await fetch(API_ENDPOINTS.GENERATE_WEBSSH_TOKEN, {
        method: 'POST',
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        return data.token;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error generating WebSSH token:', error);
      throw error;
    }
  }

  // Redirect ke WebSSH dengan token
  static async redirectToWebSSH(websshUrl) {
    try {
      const isAuthenticated = await this.checkPortalAuth();
      
      if (!isAuthenticated) {
        // Redirect ke login portal
        window.location.href = '/login';
        return;
      }

      // Generate token untuk WebSSH
      const token = await this.generateWebSSHToken();
      
      // Redirect ke WebSSH dengan token
      const redirectUrl = `${websshUrl}?portal_token=${token}`;
      window.open(redirectUrl, '_blank');
      
    } catch (error) {
      console.error('Error redirecting to WebSSH:', error);
      // Fallback: redirect ke login
      window.location.href = '/login';
    }
  }
}