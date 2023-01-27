import { main } from './main';
import { progress } from './progress';
import { snackBar } from './snack-bar';

export const dom = {
  progress: progress(),
  snackBar: snackBar(),
  main: main()
}
