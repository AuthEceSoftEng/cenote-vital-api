/* eslint-disable no-restricted-syntax, no-await-in-loop */
const express = require('express');
const { Producer } = require('sinek');
const uuid = require('uuid/v4');

const { Project } = require('../models');

const router = express.Router({ mergeParams: true });
const config = { zkConStr: process.env.ZOOKEEPER_SERVERS };
const producer = new Producer(config, [process.env.KAFKA_TOPIC], 15);
producer.on('error', console.error);
producer.connect();

/**
 * @apiDefine ProjectNotFoundError
 * @apiError ProjectNotFoundError The id of the Project was not found.
 * @apiErrorExample {json} ProjectNotFoundError:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "ProjectNotFoundError"
 *     }
 */
/**
* @apiDefine NoCredentialsSentError
* @apiError NoCredentialsSentError No key credentials sent.
* @apiErrorExample {json} NoCredentialsSentError:
*     HTTP/1.1 403 Forbidden
*     {
*       "error": "NoCredentialsSentError"
*     }
*/
/**
* @apiDefine KeyNotAuthorizedError
* @apiError KeyNotAuthorizedError Key hasn't authorization.
* @apiErrorExample {json} KeyNotAuthorizedError:
*     HTTP/1.1 401 Unauthorized
*     {
*       "error": "KeyNotAuthorizedError"
*     }
*/
/**
* @apiDefine NoDataSentError
* @apiError NoDataSentError No data sent.
* @apiErrorExample {json} NoDataSentError:
*     HTTP/1.1 400 Bad Request
*     {
*       "error": "NoDataSentError"
*     }
*/
/**
* @api {post} /projects/:PROJECT_ID/events/:EVENT_COLLECTION Record events
* @apiVersion 0.1.0
* @apiName RecordEvents
* @apiGroup Events
* @apiParam {String} PROJECT_ID Project's unique ID.
* @apiParam {String} EVENT_COLLECTION The event collection name.
* @apiParam {String} writeKey/masterKey Key for authorized write.
* @apiParam {Object/Object[]} payload Event data.
* @apiParamExample {json} payload Example:
*"payload": [{
*   "data": {
*       "current": 7.5,
*       "voltage": 10000,
*       "note": "That's weird."
*   },
*   "timestamp": 1549622362
*}]
* @apiSuccess (Accepted 202) {String} message Success Message.
* @apiSuccessExample {json} Success-Response:
*     HTTP/1.1 202 ACCEPTED
*     {
*       "message": "Event Sent."
*     }
* @apiUse ProjectNotFoundError
* @apiUse NoCredentialsSentError
* @apiUse KeyNotAuthorizedError
* @apiUse NoDataSentError
*/
router.post('/:EVENT_COLLECTION', (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, {}, { lean: true }, (err2, project) => {
  if (err2 || !project) return res.status(404).json({ error: 'ProjectNotFoundError' });
  const { writeKey, masterKey } = req.query;
  if (!writeKey && !masterKey) return res.status(403).json({ error: 'NoCredentialsSentError' });
  if (!(writeKey === project.writeKey || masterKey === project.masterKey)) return res.status(401).json({ message: 'KeyNotAuthorizedError' });
  let { payload } = req.body;
  if (!payload) return res.status(400).json({ error: 'NoDataSentError' });
  const cenote = {
    created_at: Date.now(),
    id: uuid(),
    url: `/projects/${req.params.PROJECT_ID}/events/${req.params.EVENT_COLLECTION.replace(/-/g, '').toLowerCase()}`,
  };
  if (!Array.isArray(payload)) payload = [payload];
  const allDataResponses = [];
  async function loopMessages() {
    for (const dato of payload) {
      const { data, timestamp } = dato;
      if (timestamp && Number.isInteger(timestamp) && timestamp < Date.now()) cenote.timestamp = timestamp;
      cenote.id = uuid();
      try {
        await producer.send(process.env.KAFKA_TOPIC, JSON.stringify({ data, cenote }));
        allDataResponses.push({ message: 'Event sent.' });
      } catch (error) {
        allDataResponses.push({ message: error });
      }
    }
  }
  return loopMessages().then(() => res.status(202).json(allDataResponses));
}));

module.exports = router;
