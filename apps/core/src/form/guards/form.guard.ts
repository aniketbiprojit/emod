import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RoleEnum } from '../../user/entities/user-role.enum';
import { User } from '../../user/entities/user.entity';
import { FormService } from '../form.service';

@Injectable()
export class CanUpdateFormGuard implements CanActivate {
  constructor(private readonly _formService: FormService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() === 'http') {
      const req = context.switchToHttp().getRequest();
      if (req.params.id && (req.user as User)) {
        const { form } = await this._formService.getFormById(req.params.id);
        const state = form.formState.at(-1)!;
        if (RoleEnum.SuperAdmin === req.user.role) {
          return true;
        }

        // should be from user and to should be null

        if (state.from._id.toString() !== req.user._id.toString() || state.to) {
          return false;
        }

        return true;
      }
    }

    return false;
  }
}
