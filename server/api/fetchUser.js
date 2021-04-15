import { User } from '../models';
import { hasParams, decorateRoute } from '../utils';

async function fetchUser(req, res) {
  const params = req.query;

  if (!hasParams(params, ['username'])) {
    res.send({ success: false, error: 'Bad request' });
    return;
  }
  const { username } = params;

  const user = await User.findOne({ username });
  if (user === null) {
    res.send({ });
    return;
  }

  const { email, name } = user;
  const [firstName, lastName] = name.split(' ');

  res.send({ email, firstName, lastName });
}

export default decorateRoute('/fetch-user', fetchUser);
