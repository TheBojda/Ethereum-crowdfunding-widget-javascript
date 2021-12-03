FROM public.ecr.aws/lambda/nodejs:14

# deps from https://alex-tran.medium.com/building-node-canvas-container-for-aws-lambda-a3b732aa48c0

RUN yum -y update \
&& yum -y groupinstall "Development Tools" \
&& yum install -y nodejs gcc-c++ cairo-devel libjpeg-turbo-devel pango-devel giflib-devel zlib-devel librsvg2-devel

COPY build/index.js package.json config.json erc20_abi.json ./

RUN npm install --only=prod

ENV LD_PRELOAD=/var/task/node_modules/canvas/build/Release/libz.so.1

RUN yum remove -y cairo-devel libjpeg-turbo-devel pango-devel giflib-devel zlib-devel librsvg2-devel

CMD ["index.lambdaHandler"]
