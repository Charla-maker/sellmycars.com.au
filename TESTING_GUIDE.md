# Testing Guide - SellMyCars Admin Panel

## ✅ Development Server Status

**Server is running successfully!**
- URL: http://localhost:3000
- No compilation errors
- TypeScript validated
- All dependencies installed

---

## 🧪 Testing Checklist

### **Phase 1: Frontend Testing (No Database Required)**

#### 1. Test Homepage & Location Pages
These pages work WITHOUT database setup:

**✓ Test Homepage**
```
Visit: http://localhost:3000
```
**Expected:**
- Hero section with contact form
- How It Works section
- Why Us section
- 6 Location cards (Sydney CBD, Western Sydney, etc.)
- Testimonials
- Footer

**✓ Test Location Pages**
```
Click any location card OR visit:
http://localhost:3000/locations/sydney-cbd
http://localhost:3000/locations/western-sydney
http://localhost:3000/locations/northern-suburbs
http://localhost:3000/locations/eastern-suburbs
http://localhost:3000/locations/southern-sydney
http://localhost:3000/locations/inner-west
```

**Expected:**
- Page header with location name
- Google Maps embed
- Tabs: Overview, Suburbs, Get Quote
- Location description
- Services list
- Landmarks list
- Contact form in "Get Quote" tab
- Back button returns to homepage

---

### **Phase 2: Admin Panel Testing (Requires Database)**

#### Prerequisites
Before testing admin features, you MUST:

1. **Set up Supabase** (Follow SUPABASE_SETUP.md)
2. **Run database migrations**:
   ```bash
   npm run db:push
   npm run db:seed
   ```

#### 2. Test Admin Login

**✓ Login Page**
```
Visit: http://localhost:3000/admin/login
```

**Test Cases:**
1. **Empty Form**
   - Click "Sign In" without entering credentials
   - Expected: Browser validation error

2. **Invalid Credentials**
   - Email: test@test.com
   - Password: wrong
   - Expected: "Invalid email or password" error

3. **Valid Credentials** (After seeding)
   - Email: admin@sellmycars.com.au
   - Password: Admin123!
   - Expected: Redirect to /admin/dashboard

**Expected UI:**
- Clean login form
- Email and password fields
- Loading spinner during authentication
- Error messages display properly
- Responsive on mobile

---

#### 3. Test Dashboard

**✓ Dashboard Overview**
```
Visit: http://localhost:3000/admin/dashboard
(Must be logged in)
```

**Expected:**
- 4 stat cards: Pages, Posts, Submissions, Users
- Recent form submissions widget (empty initially)
- Quick actions panel
- Sidebar navigation on left
- User info in header
- Sign out button works

**Test Cases:**
1. Click each stat card (should show 0 or 1 after seeding)
2. Click quick action buttons (Create Page, Write Post, Upload Media)
3. Click sidebar menu items
4. Click "Sign Out" - should return to login page

---

#### 4. Test Pages Management

**✓ Pages List**
```
Visit: http://localhost:3000/admin/pages
```

**Expected (After Seeding):**
- One sample page "About Us"
- Search box
- Status filter dropdown
- "Create Page" button
- Table with columns: Title, Status, Author, Last Modified, Actions

**Test Cases:**
1. **Search** - Type "about" in search box
2. **Filter** - Select "Published" from status dropdown
3. **View** - Click eye icon to view published page
4. **Edit** - Click edit icon (not implemented yet, expected behavior: goes to edit page)
5. **Delete** - Click delete icon, confirm deletion

**✓ Create New Page**
```
Visit: http://localhost:3000/admin/pages/new
```

**Expected:**
- Back arrow to return to list
- Title field
- Slug field (auto-generated from title)
- Rich text editor with toolbar
- Excerpt textarea
- SEO section (Meta title, description, keywords, OG image)
- Page settings (Status, Featured image, Template)
- "Save as Draft" and "Publish Now" buttons

**Test Cases:**
1. **Auto-slug generation**
   - Type title: "Contact Us"
   - Expected: Slug auto-fills with "contact-us"

2. **Rich text editor**
   - Try all toolbar buttons (H1, H2, H3, Bold, Italic, etc.)
   - Add a link (click link icon, enter URL)
   - Add an image (click image icon, enter URL)

3. **Character counters**
   - Type in Meta Title field
   - Expected: Counter shows X/60 characters

4. **Save as Draft**
   - Fill in title: "Test Page"
   - Click "Save as Draft"
   - Expected: Redirects to pages list, new page visible with DRAFT status

5. **Publish Now**
   - Fill in title: "Published Page"
   - Click "Publish Now"
   - Expected: Page created with PUBLISHED status

6. **Validation**
   - Leave title empty, click save
   - Expected: Validation error "Title is required"

---

#### 5. Test Form Submissions

**✓ Submissions List**
```
Visit: http://localhost:3000/admin/submissions
```

**Initial State (No Submissions):**
- Empty state message
- 5 status cards all showing 0
- Search box
- Export CSV button (disabled)

**To Test With Data:**
1. **Submit Contact Form**
   - Go to http://localhost:3000
   - Fill out contact form in hero section
   - Submit

2. **View in Admin**
   - Go back to /admin/submissions
   - Refresh page
   - Expected: See your submission

**Expected:**
- Status cards show counts (1 in NEW, 0 in others)
- Table shows submission with:
  - Contact info (name, email, phone)
  - Vehicle details (make, model, year, condition)
  - Status badge
  - Submitted date/time
  - "View" button

**Test Cases:**
1. **Status Filter**
   - Click any status card (NEW, READ, etc.)
   - Expected: Filters submissions by that status

2. **Search**
   - Type name, email, or vehicle details
   - Expected: Instant filtering

3. **View Details**
   - Click "View" button
   - Expected: Modal opens with full details

4. **Detail Modal**
   - Shows all contact info
   - Shows vehicle details
   - Shows message
   - Shows submission metadata
   - "Close" and "Reply" buttons

5. **Export CSV**
   - Click "Export CSV" button
   - Expected: Downloads CSV file with all submissions

6. **Pagination**
   - (Only visible with 20+ submissions)
   - Previous/Next buttons work

---

## 🐛 Known Issues / Not Yet Implemented

### Features Not Yet Built:
1. **Edit Page** - Can create pages but not edit existing ones yet
2. **Blog Posts Management** - Planned but not built
3. **Media Library** - Planned but not built
4. **Settings Panel** - Planned but not built
5. **User Management** - Planned but not built
6. **Reply to Submission** - Button exists but doesn't do anything yet
7. **Update Submission Status** - Can't change status yet (NEW → READ, etc.)

### Minor Issues:
1. Some TypeScript warnings in console (non-blocking)
2. Old React components (App.tsx, etc.) still in src/ (not used)
3. Vite config file still present (not used)

---

## 🎯 What Should Work Perfectly:

### ✅ Frontend (No Database)
- [x] Homepage loads
- [x] All 6 location pages work
- [x] Google Maps embeds work
- [x] Contact form accepts input (doesn't save without DB)
- [x] Navigation between pages
- [x] Mobile responsive design

### ✅ Admin (With Database)
- [x] Login/logout
- [x] Dashboard with stats
- [x] Create new pages with rich text editor
- [x] List all pages
- [x] Delete pages
- [x] View form submissions
- [x] Filter submissions by status
- [x] Search submissions
- [x] Export submissions to CSV
- [x] View submission details

---

## 🚀 Quick Test Script

Run this after setting up database:

```bash
# 1. Start server (if not running)
npm run dev

# 2. Test frontend
open http://localhost:3000
# Click around homepage
# Click a location card
# Test contact form

# 3. Test admin
open http://localhost:3000/admin/login
# Login with: admin@sellmycars.com.au / Admin123!

# 4. Test dashboard
# Check stats cards
# Try quick actions

# 5. Test pages
# Create a new page
# Save as draft
# Create another and publish
# Go back to list and see both

# 6. Test submissions
# Submit contact form on homepage
# Go to admin/submissions
# View your submission
# Try export CSV

# 7. Test logout
# Click sign out
# Should redirect to login
```

---

## 📝 Reporting Issues

If you find any issues:
1. Note the exact URL you were on
2. Note what you clicked/did
3. Note what happened vs what you expected
4. Check browser console for errors (F12 → Console tab)
5. Let me know and I'll fix it!

---

## ✨ Next Steps After Testing

Once you've tested everything:
1. I can build the **Edit Page** functionality
2. I can build the **Blog Posts** management
3. I can build the **Media Library** with file uploads
4. I can build the **Settings** panel
5. Or we can deploy what we have to production!

---

**Happy Testing! 🎉**
