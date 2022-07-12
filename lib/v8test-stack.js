const { Stack, Duration } = require('aws-cdk-lib');
const { Runtime, Code, Function } = require('aws-cdk-lib/aws-lambda');
// const sqs = require('aws-cdk-lib/aws-sqs');

class V8TestStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const handler = new Function(this, "apilambda", {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset("src"),
      handler: "index.lambda_handler"
    });
  }
}

module.exports = { V8TestStack }
