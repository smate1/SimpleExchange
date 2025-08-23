# SimpleExchange

## Orders Page - Empty State Implementation

### Overview

The orders page (`orders.html`) has been updated to include an "empty state" display when there are no applications, with pagination automatically hidden when no data is available.

### Features Implemented

#### 1. Empty State Display

- **SVG Icon**: Custom search/no-data icon with the text "Немає даних" (No data)
- **Conditional Rendering**: Toggle between empty state and data table
- **Responsive Design**: Adapts to different screen sizes

#### 2. Pagination Management

- **HTML**: Pagination section restored with `orders__pagination--hidden` class by default
- **CSS**: Pagination styles restored with responsive design and hidden state
- **JavaScript**: Pagination functionality restored with automatic visibility control

### Technical Implementation

#### HTML Structure

- Empty state block (`.orders-table__empty`) with SVG icon and text
- Data table (`.orders-table`) with `--hidden` class by default
- Table header (`.orders-table__head`) preserved as requested
- Pagination section restored with `--hidden` class by default

#### CSS Styling

- Empty state styles with responsive breakpoints
- Hidden table state (`.orders-table--hidden`)
- Pagination styles with responsive design and hidden state
- Demo toggle button styling (can be removed in production)

#### JavaScript Functionality

- `initOrdersTableToggle()` function for switching between states
- `initPagination()` function for pagination functionality
- Demo button for testing (can be removed in production)
- Automatic initialization of empty state

### Files Modified

1. **`orders.html`**

   - Added empty state HTML structure
   - Restored pagination section with `--hidden` class
   - Updated order count to 0

2. **`css/style.css`**

   - Added empty state styles
   - Restored pagination styles with responsive design
   - Added responsive design for empty state

3. **`js/main.js`**
   - Added table toggle functionality
   - Restored pagination functionality with visibility control
   - Added demo button functionality

### Usage

#### Default State

- Page loads with empty state active
- Order count shows "0"
- Table is hidden

#### Toggle Functionality

- Demo button allows switching between empty state and data table
- Order count updates accordingly (0 for empty, 7 for data)
- Pagination automatically shows/hides based on data state

#### Responsive Design

- Empty state adapts to mobile devices
- Icon and text scale appropriately
- Maintains visual hierarchy across screen sizes

#### Pagination Behavior

- **Empty State**: Pagination is automatically hidden (`orders__pagination--hidden`)
- **Data Available**: Pagination becomes visible and functional
- **Responsive**: Pagination adapts to different screen sizes

### Notes

- The demo toggle button is included for testing purposes and can be removed in production
- Table header structure is preserved as requested
- Pagination is automatically hidden when no data is available
- Empty state follows BEM methodology for CSS class naming

### Future Considerations

- Integration with real data sources
- Dynamic empty state content
- Additional empty state variations for different scenarios
- Enhanced pagination with dynamic page count
- Server-side pagination integration
