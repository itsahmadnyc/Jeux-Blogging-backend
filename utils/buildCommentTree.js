

  function buildCommentTree(comments) {
    const commentMap = new Map();
    const roots = [];
  
    //ONE SINGLE PASS TO CONVERT AND MAP
    for (const rawComment of comments) {
      const comment = rawComment.toJSON(); 
      comment.replies = []; 
      commentMap.set(comment.id, comment);
    }
  
    // SECONT PASS TO LINK PARENTS AND CHILDRENS
    for (const comment of commentMap.values()) {
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(comment);
        }
      } else {
        roots.push(comment);
      }
    }
  
    return roots;
  }
  
  module.exports = { buildCommentTree };
  

