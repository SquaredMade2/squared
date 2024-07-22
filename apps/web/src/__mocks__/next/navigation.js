const routerPushMock = jest.fn();

export const useRouter = () => ({
  route: '/',
  pathname: '',
  query: {},
  asPath: '',
  push: routerPushMock,
});

export const useParams = () => ({
  workspace: 'mockedWorkspace',
});
