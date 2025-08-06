export const navbarStyles = `
  .dial-container {
    position: fixed;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 50;
    overflow: hidden;
  }

  .dial-wrapper {
    position: relative;
    transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .semicircle-track {
    background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 50%, #000000 100%);
    position: absolute;
    border-radius: 50%;
    transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .inner-track {
    background: #f5f5f5;
    position: absolute;
    border-radius: 50%;
    transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .inner-track:hover { background: #e8e8e8; }

  .center-hub {
    background: linear-gradient(135deg, #333333 0%, #1a1a1a 100%);
    border: 4px solid #f5f5f5;
    border-radius: 50%;
    position: absolute;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
  }

  .center-hub:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6), inset 0 2px 0 rgba(255, 255, 255, 0.3);
  }

  .inner-profile-circle {
    background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
    border: 3px solid #333333;
    border-radius: 50%;
    position: absolute;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 6px 16px rgba(74, 144, 226, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 180;
  }

  .inner-profile-circle:hover {
    transform: scale(1.1);
    background: linear-gradient(135deg, #5ba0f2 0%, #4680cd 100%);
  }

  .inner-profile-circle.signup {
    background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
  }

  .inner-profile-circle.signup:hover {
    background: linear-gradient(135deg, #34ce57 0%, #28a745 100%);
  }

  .nav-button {
    background: #ffffff;
    border: 3px solid #333333;
    border-radius: 50%;
    position: absolute;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-button:hover {
    background: #333333;
    transform: scale(1.15);
  }

  .nav-button:hover .nav-icon,
  .nav-button.active .nav-icon {
    color: #ffffff !important;
  }

  .nav-button.active {
    background: #333333;
  }

  .nav-icon {
    transition: color 0.3s ease;
    color: #333333;
  }

  .tooltip {
    position: fixed;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 14px;
    pointer-events: none;
    z-index: 1000;
    white-space: nowrap;
    backdrop-filter: blur(10px);
    transition: opacity 0.2s ease;
  }
`;
