import React, { Component, ReactNode } from 'react';
import { Result, Button, Typography, Card } from 'antd';
import { ExclamationCircleOutlined, ReloadOutlined, HomeOutlined } from '@ant-design/icons';
import './ErrorBoundary.css';

const { Paragraph, Text } = Typography;

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <Card className="error-card">
            <Result
              status="error"
              icon={<ExclamationCircleOutlined className="error-icon" />}
              title="Oops! Something went wrong"
              subTitle="We encountered an unexpected error. Our team has been notified."
              extra={[
                <Button 
                  type="primary" 
                  icon={<ReloadOutlined />}
                  onClick={this.handleReload}
                  key="reload"
                  size="large"
                >
                  Reload Page
                </Button>,
                <Button 
                  icon={<HomeOutlined />}
                  onClick={this.handleGoHome}
                  key="home"
                  size="large"
                >
                  Go Home
                </Button>
              ]}
            >
              <div className="error-details">
                <Paragraph>
                  <Text strong>What happened?</Text>
                </Paragraph>
                <Paragraph>
                  The application encountered an unexpected error while processing your request. 
                  This could be due to a temporary issue or a problem with the current page.
                </Paragraph>
                
                <Paragraph>
                  <Text strong>What can you do?</Text>
                </Paragraph>
                <ul className="error-suggestions">
                  <li>Try reloading the page</li>
                  <li>Go back to the home page</li>
                  <li>Check your internet connection</li>
                  <li>Contact support if the problem persists</li>
                </ul>

                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="error-technical">
                    <summary>Technical Details (Development Only)</summary>
                    <pre className="error-stack">
                      {this.state.error.toString()}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            </Result>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;