import { environment } from '../../../environments/environment.development';

const { production } = environment;

const nullFx = () => void 0;

const logger = {
  log: production ? nullFx : console.log,
  error: production ? nullFx : console.error,
};

export default logger;
