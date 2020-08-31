import Comment from '../models/Comment';

export const create = async (fields) => {
  const comment = await Comment.create(fields);
  return comment;
};

export const find = async (id, options) => {
  const comment = await Comment.findByPk(id, options);
  return comment;
};

export const remove = async (condition) => {
  const comment = await Comment.destroy(condition);
  return comment;
};
