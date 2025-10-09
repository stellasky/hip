# Quickstart Guide: Musical Band Fan Appreciation App

## Development Setup

### Prerequisites
- Node.js 18+ installed
- AWS CLI configured with appropriate permissions
- AWS Amplify CLI installed globally: `npm install -g @aws-amplify/cli`
- Git repository cloned and checked out to feature branch `001-modify-this-app`

### Initial Setup
```bash
# Install dependencies
npm install

# Initialize Amplify backend (if not already done)
npx ampx configure

# Deploy backend resources to sandbox
npx ampx sandbox

# Start development server
npm run dev
```

## User Journey Testing Scenarios

### Scenario 1: New User Registration and First Visit
**Objective**: Verify complete user onboarding flow

**Steps**:
1. Open the application in browser (http://localhost:5173)
2. Click "Sign Up" button
3. Fill registration form with valid email and password
4. Verify email through Cognito verification email
5. Sign in with new credentials
6. **Expected**: User lands on band selection page
7. **Expected**: User profile shows 0 visits, 0 photos, 0 comments

**Acceptance Criteria**:
- [ ] Registration form validates input correctly
- [ ] Email verification works end-to-end
- [ ] User can sign in after verification
- [ ] App redirects to main interface after authentication
- [ ] User starts with empty activity history

### Scenario 2: Band Selection and POI Discovery
**Objective**: Test core band and POI browsing functionality

**Steps**:
1. From band selection page, browse available bands
2. Click on a band (e.g., "The Beatles")
3. View the band detail page showing associated POIs
4. Switch between list view and map view
5. Click on a POI marker in map view
6. View POI detail page

**Expected Results**:
- [ ] Band list loads with names, images, and basic info
- [ ] Band detail page shows description and POI count
- [ ] List view shows POI names, addresses, and descriptions
- [ ] Map view displays POI markers at correct coordinates
- [ ] View switching is smooth and maintains POI selection
- [ ] POI detail page shows historical significance and images

### Scenario 3: Visit Tracking
**Objective**: Test visit marking and tracking functionality

**Steps**:
1. Navigate to a POI detail page
2. Click "Mark as Visited" button
3. Add optional visit notes
4. Save visit record
5. Navigate to user profile
6. View visit history

**Expected Results**:
- [ ] Visit button toggles state correctly
- [ ] Visit date is automatically recorded
- [ ] Optional notes are saved with visit
- [ ] User profile shows updated visit count
- [ ] Visit history displays POI details and visit dates
- [ ] Can toggle visit status (visited ↔ not visited)

### Scenario 4: Community Features (Comments)
**Objective**: Test commenting system and social features

**Steps**:
1. Navigate to a POI with existing comments
2. Read existing comments from other users
3. Add a new comment
4. Edit the comment (test last-write-wins)
5. View comment with username and timestamp

**Expected Results**:
- [ ] Comments display in chronological order
- [ ] New comments appear immediately after posting
- [ ] Username displays correctly with each comment
- [ ] Timestamps show relative time (e.g., "2 hours ago")
- [ ] Comment editing works with last-write-wins strategy
- [ ] Empty or whitespace-only comments are rejected

### Scenario 5: Photo Upload and Management
**Objective**: Test photo upload, storage limits, and display

**Steps**:
1. Navigate to a POI detail page
2. Click "Upload Photo" button
3. Select image file (under 10MB)
4. Add optional caption
5. Upload photo
6. View uploaded photo in POI gallery
7. Check user storage usage in profile

**Expected Results**:
- [ ] File picker accepts image files only
- [ ] Files over 10MB are rejected with clear error
- [ ] Photo uploads show progress indicator
- [ ] Uploaded photos appear in POI gallery
- [ ] Captions display correctly with photos
- [ ] User storage usage updates accurately
- [ ] Photos from other users are visible

### Scenario 6: Storage Limits and Error Handling
**Objective**: Test storage quotas and graceful error handling

**Steps**:
1. Upload photos until approaching 200MB limit
2. Attempt to upload when at limit
3. Delete some photos to free space
4. Attempt upload of oversized file (>10MB)
5. Test network failure scenarios

**Expected Results**:
- [ ] Storage usage accurately tracked in profile
- [ ] Upload blocked when approaching 200MB limit
- [ ] Clear error message when storage limit reached
- [ ] Deleted photos free up storage immediately
- [ ] Oversized files rejected before upload starts
- [ ] Network errors handled gracefully with retry options

### Scenario 7: Map Integration and Offline Capability
**Objective**: Test mapping functionality and offline features

**Steps**:
1. Switch to map view with multiple POIs
2. Zoom and pan around the map
3. Click on different POI markers
4. Test map in offline mode (disconnect network)
5. Reconnect and verify data sync

**Expected Results**:
- [ ] Map renders quickly with all POI markers
- [ ] Markers show band-specific icons or colors
- [ ] Clicking markers opens POI info popup
- [ ] Map remains functional when offline (cached tiles)
- [ ] POI data syncs properly when reconnected
- [ ] Map performance is smooth during interactions

## Performance Testing

### Load Time Targets
- [ ] Initial app load: < 3 seconds on 3G connection
- [ ] Band list load: < 2 seconds
- [ ] Map rendering: < 3 seconds with 20+ POIs
- [ ] Photo upload progress: Updates every 10% completion
- [ ] Page transitions: < 500ms between views

### Responsive Design Verification
- [ ] Mobile portrait (320px): All features accessible
- [ ] Mobile landscape (568px): Map view usable
- [ ] Tablet (768px): Optimal two-column layout
- [ ] Desktop (1024px+): Full feature set visible

## Security Testing

### Authentication Verification
- [ ] Unauthenticated users redirected to sign-in
- [ ] Invalid credentials rejected with clear message
- [ ] Password requirements enforced (Cognito policies)
- [ ] Session expires after appropriate timeout

### Authorization Testing
- [ ] Users can only edit their own visits/comments/photos
- [ ] Deleted users' content becomes anonymous or removed
- [ ] File upload permissions restricted to authenticated users
- [ ] API endpoints reject unauthorized requests

## Accessibility Testing

### Screen Reader Compatibility
- [ ] All interactive elements have proper ARIA labels
- [ ] Map markers are keyboard navigable
- [ ] Form inputs have associated labels
- [ ] Error messages are announced to screen readers

### Keyboard Navigation
- [ ] Tab order follows logical flow
- [ ] All buttons and links keyboard accessible
- [ ] Map can be navigated with arrow keys
- [ ] Modal dialogs trap focus appropriately

## Browser Compatibility

### Desktop Browsers
- [ ] Chrome 90+ (primary target)
- [ ] Firefox 88+ (secondary)
- [ ] Safari 14+ (secondary)
- [ ] Edge 90+ (secondary)

### Mobile Browsers
- [ ] iOS Safari 14+
- [ ] Chrome Mobile 90+
- [ ] Samsung Internet 14+

## Deployment Verification

### Amplify Hosting
- [ ] Production build deploys successfully
- [ ] HTTPS certificate configured correctly
- [ ] CDN caching works for static assets
- [ ] Environment variables set properly

### Backend Services  
- [ ] AppSync API endpoint accessible
- [ ] DynamoDB tables created with correct schema
- [ ] S3 bucket configured for photo storage
- [ ] Cognito user pool configured correctly

## Troubleshooting Common Issues

### Authentication Problems
- Check Amplify configuration in `src/main.tsx`
- Verify Cognito user pool settings match `amplify/auth/resource.ts`
- Clear browser local storage and retry

### Map Not Loading
- Verify Amazon Location Service is enabled
- Check API keys and permissions
- Confirm network connectivity for tile requests

### Photo Upload Failures
- Check S3 bucket permissions
- Verify file size under 10MB
- Confirm user hasn't exceeded storage quota

### Performance Issues
- Enable React 19 Compiler optimizations
- Check for memory leaks in map components
- Verify image optimization settings

This quickstart guide validates all critical user paths and ensures the application meets functional and non-functional requirements specified in the feature specification.