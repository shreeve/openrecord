var Store = require('../../../lib/store')


module.exports = function(title, beforeFn, afterFn, storeConf){
  describe(title + ': Order', function(){
    var store

    before(beforeFn)
    after(function(next){
      afterFn(next, store)
    })


    before(function(){
      store = new Store(storeConf)
      store.setMaxListeners(0)

      store.Model('User', function(){
        this.hasMany('posts')
        this.hasMany('threads')
        this.attribute('foo', Number)
      })
      store.Model('Post', function(){
        this.belongsTo('user')
        this.belongsTo('thread')
      })
      store.Model('Thread', function(){
        this.belongsTo('user')
        this.hasMany('posts')
      })
    })


    it('Order by a single field', function(done){
      store.ready(function(){
        var User = store.Model('User')

        User.order('login').exec(function(users){
          users[0].login.should.be.equal('admin')
          users[1].login.should.be.equal('administrator')
          users[2].login.should.be.equal('michl')
          users[3].login.should.be.equal('phil')
          done()
        })
      })
    })

    it('Order by a single field DESC', function(done){
      store.ready(function(){
        var User = store.Model('User')

        User.order('login', true).exec(function(users){
          users[3].login.should.be.equal('admin')
          users[2].login.should.be.equal('administrator')
          users[1].login.should.be.equal('michl')
          users[0].login.should.be.equal('phil')
          done()
        })
      })
    })

    it('Order by a multiple fields (multiple calls)', function(done){
      store.ready(function(){
        var User = store.Model('User')

        User.order('created_at').order('login').exec(function(users){
          users[0].login.should.be.equal('admin')
          users[1].login.should.be.equal('administrator')
          users[2].login.should.be.equal('phil')
          users[3].login.should.be.equal('michl')
          done()
        })
      })
    })

    it('Order by a multiple fields DESC (multiple calls)', function(done){
      store.ready(function(){
        var User = store.Model('User')

        User.order('created_at').order('login', true).exec(function(users){
          users[0].login.should.be.equal('phil')
          users[1].login.should.be.equal('administrator')
          users[2].login.should.be.equal('admin')
          users[3].login.should.be.equal('michl')
          done()
        })
      })
    })

    it('Order by a multiple fields (single calls)', function(done){
      store.ready(function(){
        var User = store.Model('User')

        User.order(['created_at', 'login']).exec(function(users){
          users[0].login.should.be.equal('admin')
          users[1].login.should.be.equal('administrator')
          users[2].login.should.be.equal('phil')
          users[3].login.should.be.equal('michl')
          done()
        })
      })
    })
  })
}
