import { BlogActions } from '../support/actions/BlogActions';

describe('TC-BLOG-001 - Happy path: crear comentario pendiente de aprobación', () => {
  const actions = new BlogActions();

  it('debe dejar el comentario en estado pendiente/en revisión', () => {
    actions.visitHome();
    
    // Uncomment the next line if you need to debug page structure
    // actions.debugPageStructure();
    
    actions.openFirstPost();
    actions.scrollToCommentForm();

    actions.fillCommentForm({
      name: 'QA Tester',
      email: 'qa_test@example.com',
      website: 'https://example.com',
      comment: 'esto fue creado con automatización',
    });

    actions.submitComment();
    actions.assertAwaitingModeration();
  });
});
