import { assert, expect } from 'chai';
import { Util } from '..';

describe('Util', () => {
  describe('jail', () => {
    it('jails', () => {
      const actual = Util.jail('foo/bar', '/', false);
      assert.equal('/foo/bar', actual);
    });

    it('jails absolute path', () => {
      // the "/" represents the root of the disk
      const actual = Util.jail('/foo/bar', '/', true);
      assert.equal('/foo/bar', actual);
    });

    it('throws error when outside jail', () => {
        const actual = () => Util.jail('../bar', '/foo', true);
        expect(actual).to.throw("no such file or directory '../bar'");
    });
  });
});
