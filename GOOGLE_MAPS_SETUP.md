# Google Maps Setup Guide

## Current Status
The Map component has been configured with error handling and a fallback system. If Google Maps fails to load, it will automatically switch to a fallback dashboard view.

## Setting up Google Maps API Key

### 1. Get a Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API (optional, for enhanced features)
4. Go to "Credentials" and create an API key
5. Restrict the API key to your domain for security

### 2. Configure the API Key

#### For Development:
1. Update the `.env` file in the root directory:
```
REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

#### For Production:
1. Create a `.env.production` file:
```
REACT_APP_GOOGLE_MAPS_API_KEY=your_production_api_key_here
```

### 3. API Key Restrictions (Recommended)
- **Application restrictions**: HTTP referrers (websites)
- **Allowed referrers**: 
  - `localhost:3000/*` (for development)
  - `your-domain.com/*` (for production)
- **API restrictions**: Restrict to Maps JavaScript API

## Fallback System
If Google Maps fails to load due to:
- Missing or invalid API key
- Network issues
- API quota exceeded
- Browser restrictions

The application will automatically show a dashboard view with:
- All monitoring locations as cards
- Filtering capabilities
- Detailed location information
- Status indicators

## Troubleshooting

### Common Issues:
1. **"This page didn't load Google Maps correctly"**
   - Check if API key is correctly set in `.env`
   - Verify API key restrictions
   - Check browser console for detailed errors

2. **Quota exceeded errors**
   - Check your Google Cloud Console quota usage
   - Consider upgrading your plan if needed

3. **Development vs Production keys**
   - Use different API keys for development and production
   - Set appropriate domain restrictions

### Error Detection:
The component includes:
- Loading timeouts (10 seconds)
- Error callbacks
- Automatic fallback activation
- User-friendly error messages

## Testing
- **With API key**: Full Google Maps functionality
- **Without API key**: Automatic fallback to dashboard view
- **Network issues**: Graceful degradation with retry options

## Cost Optimization
- API key restrictions prevent unauthorized usage
- Consider caching strategies for production
- Monitor usage in Google Cloud Console
- Set up billing alerts

## Support
If you continue to experience issues:
1. Check the browser console for detailed error messages
2. Verify your Google Cloud Console settings
3. Test with a fresh API key
4. Use the fallback mode for immediate functionality