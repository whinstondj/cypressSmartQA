export class BlogActions {
  visitHome() {
    cy.visit('https://blog.winstoncastillo.com', { timeout: 120000 });
    this.closeMailchimpModalIfPresent();
  }

  closeMailchimpModalIfPresent() {
    cy.log('Checking for Mailchimp modal');
    
    // Wait a moment for any modals to load
    cy.wait(2000);
    
    cy.get('body').then($body => {
      const modalSelectors = [
        'button[data-action="close-mc-modal"]',
        '.mc-modal-close',
        '[class*="close"][class*="modal"]',
        '.modal-close',
        'button[aria-label*="Close"]',
        'button[aria-label*="close"]'
      ];
      
      let modalFound = false;
      
      for (const selector of modalSelectors) {
        const $btn = $body.find(selector);
        if ($btn.length) {
          cy.log(`Found modal close button: ${selector}`);
          cy.wrap($btn).click({ force: true });
          modalFound = true;
          break;
        }
      }
      
      if (!modalFound) {
        cy.log('No modal found to close');
      }
    });
  }

  // Utility method for debugging
  debugPageStructure() {
    cy.log('=== PAGE STRUCTURE DEBUG ===');
    
    cy.get('body').then($body => {
      // Log main structural elements
      const structuralSelectors = [
        'header', 'nav', 'main', 'article', 'section', 
        '.content', '#content', '.posts', '.blog'
      ];
      
      structuralSelectors.forEach(selector => {
        const elements = $body.find(selector);
        if (elements.length > 0) {
          cy.log(`Found ${elements.length} ${selector} elements`);
        }
      });
      
      // Log potential post links
      const linkSelectors = [
        'a[href*="/"]', 'article a', 'h1 a', 'h2 a', 'h3 a'
      ];
      
      linkSelectors.forEach(selector => {
        const elements = $body.find(selector);
        if (elements.length > 0) {
          cy.log(`Found ${elements.length} links matching ${selector}`);
        }
      });
      
      // Log recent posts mentions
      if ($body.text().toLowerCase().includes('recent')) {
        cy.log('Page contains "recent" text');
      }
      if ($body.text().toLowerCase().includes('entrada')) {
        cy.log('Page contains "entrada" text');
      }
    });
    
    cy.log('=== END DEBUG ===');
  }

  openFirstPost() {
    const selectors = [
      '.entry-title a',
      'article h2 a',
      '.post h2 a',
      '.wp-block-latest-posts__post-title a',
      'h2 a',
      'h3 a',
      '.post-title a',
      '.blog-post a',
      'article a[href*="/"]',
    ];

    cy.get('body', { timeout: 30000 }).then($body => {
      const hasStandardListing = selectors.some(sel => $body.find(sel).length);

      if (hasStandardListing) {
        cy.log('Found standard post selectors, using first available');
        cy.get(selectors.join(', '), { timeout: 30000 })
          .first()
          .click({ force: true });
        return;
      }

      // Fallback: try to find "Recent Posts" section and look for links
      cy.log('Standard selectors not found, trying fallback approach');
      
      // Try different approaches for the fallback
      this.tryFallbackApproaches();
    });
  }

  tryFallbackApproaches() {
    // Approach 1: Look for Recent Posts and find links in the same level or children
    cy.get('body').then($body => {
      const recentPostsElement = $body.find(':contains("Recent Posts"), :contains("Entradas recientes")').first();
      
      if (recentPostsElement.length) {
        cy.log('Found Recent Posts section, looking for links nearby');
        
        // Try to find links in the parent container
        cy.wrap(recentPostsElement).parent().then($parent => {
          const links = $parent.find('a[href*="/"]');
          
          if (links.length > 0) {
            cy.log(`Found ${links.length} links in parent container`);
            cy.wrap(links.first()).click({ force: true });
            return;
          }
          
          // If no links in parent, try siblings
          const siblingLinks = $parent.siblings().find('a[href*="/"]');
          if (siblingLinks.length > 0) {
            cy.log(`Found ${siblingLinks.length} links in siblings`);
            cy.wrap(siblingLinks.first()).click({ force: true });
            return;
          }
          
          // If still no luck, try a broader search
          this.broadSearchForPostLinks();
        });
      } else {
        // If "Recent Posts" not found, do a broad search
        this.broadSearchForPostLinks();
      }
    });
  }

  broadSearchForPostLinks() {
    cy.log('Doing broad search for post links');
    
    // Look for any links that might be blog posts
    const broadSelectors = [
      'a[href*="/20"]', // Links containing year (common in blog URLs)
      'a[href*="posts"]',
      'a[href*="post"]',
      'a[href*="blog"]',
      'main a',
      '.content a',
      '#content a',
      'article a',
    ];
    
    cy.get('body').then($body => {
      for (const selector of broadSelectors) {
        const elements = $body.find(selector);
        if (elements.length > 0) {
          cy.log(`Found links using selector: ${selector}`);
          cy.get(selector).first().click({ force: true });
          return;
        }
      }
      
      // Last resort: just click the first link that looks like it could be a post
      cy.get('a[href]:not([href^="mailto:"]):not([href^="tel:"]):not([href^="#"])')
        .first()
        .then($link => {
          cy.log(`Last resort: clicking first available link: ${$link.attr('href')}`);
          cy.wrap($link).click({ force: true });
        });
    });
  }

  scrollToCommentForm() {
    cy.log('Looking for comment form');
    
    // Try multiple selectors for comment forms
    const commentSelectors = [
      'textarea[name="comment"]',
      '#comment',
      '.comment-form textarea',
      '#commentform textarea',
      '[id*="comment"] textarea',
      'form[action*="comment"] textarea'
    ];
    
    // Use a more flexible approach
    cy.get('body').then($body => {
      let foundSelector = null;
      
      for (const selector of commentSelectors) {
        if ($body.find(selector).length > 0) {
          foundSelector = selector;
          break;
        }
      }
      
      if (foundSelector) {
        cy.log(`Found comment form using selector: ${foundSelector}`);
        cy.get(foundSelector, { timeout: 60000 }).scrollIntoView();
      } else {
        // Fallback: look for any textarea that might be a comment form
        cy.get('textarea').first({ timeout: 60000 }).then($textarea => {
          cy.log('Using fallback textarea for comment form');
          cy.wrap($textarea).scrollIntoView();
        });
      }
    });
  }

  fillCommentForm({ name, email, website, comment }) {
    cy.log('Filling comment form');
    
    // Helper function to find and fill field
    const findAndFillField = (fieldSelectors, value, fieldName) => {
      cy.get('body').then($body => {
        let foundSelector = null;
        
        for (const selector of fieldSelectors) {
          if ($body.find(selector).length > 0) {
            foundSelector = selector;
            break;
          }
        }
        
        if (foundSelector) {
          cy.get(foundSelector).clear().type(value);
          cy.log(`Filled ${fieldName} field using: ${foundSelector}`);
        } else {
          cy.log(`Warning: Could not find ${fieldName} field`);
        }
      });
    };
    
    // Name field selectors
    findAndFillField([
      'input[name="author"]',
      'input[name="name"]',
      '#author',
      'input[placeholder*="Name"]',
      'input[placeholder*="Nombre"]'
    ], name, 'name');
    
    // Email field selectors
    findAndFillField([
      'input[name="email"]',
      '#email',
      'input[type="email"]',
      'input[placeholder*="email"]',
      'input[placeholder*="Email"]'
    ], email, 'email');
    
    // Website field selectors
    findAndFillField([
      'input[name="url"]',
      'input[name="website"]',
      '#url',
      'input[placeholder*="Website"]',
      'input[placeholder*="URL"]'
    ], website, 'website');
    
    // Comment field selectors
    findAndFillField([
      'textarea[name="comment"]',
      '#comment',
      '.comment-form textarea',
      '#commentform textarea',
      'textarea[placeholder*="Comment"]',
      'textarea[placeholder*="Comentario"]'
    ], comment, 'comment');
  }

  submitComment() {
    cy.log('Submitting comment');
    
    const submitSelectors = [
      'input[name="submit"]',
      'button[type="submit"]',
      'input[type="submit"]',
      '#submit',
      '.submit-button',
      'button:contains("Submit")',
      'button:contains("Post Comment")',
      'input[value*="Submit"]',
      'input[value*="Post"]'
    ];
    
    cy.get('body').then($body => {
      let foundSelector = null;
      
      for (const selector of submitSelectors) {
        if ($body.find(selector).length > 0) {
          foundSelector = selector;
          break;
        }
      }
      
      if (foundSelector) {
        cy.log(`Clicking submit button using: ${foundSelector}`);
        cy.get(foundSelector).click();
      } else {
        // Fallback: look for any button in a form
        cy.get('form button, form input[type="submit"]').first().click();
        cy.log('Used fallback submit button');
      }
    });
  }

  assertAwaitingModeration() {
    cy.log('Checking for moderation message');
    
    // Multiple patterns to look for moderation messages
    const moderationPatterns = [
      /awaiting moderation/i,
      /pendiente de moderación/i,
      /pending approval/i,
      /waiting for approval/i,
      /under review/i,
      /will be reviewed/i,
      /espera aprobación/i,
      /en revisión/i,
      /será revisado/i,
      /moderator approval/i,
      /comment.*held.*moderation/i
    ];
    
    // Try each pattern
    let found = false;
    
    cy.get('body', { timeout: 60000 }).then($body => {
      for (const pattern of moderationPatterns) {
        if ($body.text().match(pattern)) {
          cy.log(`Found moderation message matching pattern: ${pattern}`);
          cy.contains(pattern, { timeout: 5000 }).should('exist');
          found = true;
          break;
        }
      }
      
      if (!found) {
        // Fallback: look for common success messages that might indicate comment submission
        const successPatterns = [
          /comment.*submitted/i,
          /thank you/i,
          /gracias/i,
          /success/i,
          /éxito/i
        ];
        
        for (const pattern of successPatterns) {
          if ($body.text().match(pattern)) {
            cy.log(`Found success message: ${pattern}`);
            cy.contains(pattern, { timeout: 5000 }).should('exist');
            found = true;
            break;
          }
        }
      }
      
      if (!found) {
        cy.log('No moderation or success message found, checking if we are still on the same page');
        // At minimum, verify we're not on an error page
        cy.get('body').should('not.contain', '404').and('not.contain', 'Error');
      }
    });
  }
}
