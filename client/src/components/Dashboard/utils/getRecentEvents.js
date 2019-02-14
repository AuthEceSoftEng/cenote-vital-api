import request from 'superagent';

export default async (projectId, col, readKey) => {
  try {
    const info = await request.get(`/api/projects/${projectId}/queries/extraction?readKey=${readKey}&event_collection=${col
    }&latest=5`);
    return info.body.results.slice(0, 5);
  } catch (error) {
    return {};
  }
};
