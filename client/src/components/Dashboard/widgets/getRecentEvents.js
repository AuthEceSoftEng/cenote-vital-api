import request from 'superagent';

export default async (projectId, col, readKey, columns) => {
  try {
    const info = await request.get(`/api/projects/${projectId}/queries/extraction?readKey=${readKey}&event_collection=${col
    }&target_property=${columns.map(el => el.column_name).join(',')}&latest=5`);
    return info.body.msg.slice(0, 5);
  } catch (error) {
    return {};
  }
};
