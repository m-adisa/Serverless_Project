import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { getAllTodos } from '../../helpers/BusinessLogic/todos'
import { createLogger } from '../../utils/logger';
import { parseUserId } from '../../auth/utils'
import { getToken } from '../../auth/utils'

const logger = createLogger('getTodos');

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info('Processing GetTodos event...');
  const jwtToken: string = getToken(event);
  const userId = parseUserId(jwtToken)
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  };

  try {
    const todoList = await getAllTodos(userId)
    logger.info('Successfully retrieved todolist');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ todoList })
    };
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error })
    };
  }
};
