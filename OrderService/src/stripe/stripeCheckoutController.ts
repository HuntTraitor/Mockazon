import { Body, Controller, Response, Route, Post, SuccessResponse } from 'tsoa';

import { StripeCheckoutService } from './stripeCheckoutService';
import { Session, SessionInput, Error } from './index';

@Route('stripeCheckout')
export class StripeCheckoutController extends Controller {
  @Post('')
  @SuccessResponse('201', 'Created checkout session')
  @Response('400', 'Bad request')
  public async createCheckoutSession(
    @Body() sessionInput: SessionInput
  ): Promise<Session | Error> {
    const result = await new StripeCheckoutService().createCheckoutSession(
      sessionInput.lineItems,
      sessionInput.shopperId.shopperId,
      sessionInput.origin,
      sessionInput.locale,
    );
    if ('status' in result && result.status) {
      this.setStatus(result.status);
    }
    return result;
  }
}
