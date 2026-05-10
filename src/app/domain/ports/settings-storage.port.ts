import { AppSettings } from '../entities/settings';

export abstract class SettingsStoragePort {
  abstract load(): AppSettings;
  abstract save(settings: AppSettings): void;
}