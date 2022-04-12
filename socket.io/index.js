const { Socket } = require('socket.io')
const { User, UserProfile, Chat } = require('../models')
const { getFileImageUrl } = require('../helpers')
const { verify } = require('jsonwebtoken')
const { jwtSecret } = require('../config')
const { Op } = require('sequelize')

const connectUser = {}

/**
 *
 * @param {Socket} io
 */
module.exports = (io) => {
  io.use(function (socket, next) {
    if (socket?.handshake?.auth && socket?.handshake?.auth?.token) {
      next()
    } else {
      next(new Error('Cannnot make handhake'))
    }
  })

  io.on('connection', (socket) => {
    console.log(`User conected with id: ${socket.id}`)

    const token = socket.handshake.auth.token
    const userToken = verify(token, jwtSecret)
    const { id: idSender } = userToken

    connectUser[idSender] = socket.id

    socket.on('load admin contact', async () => {
      try {
        const user = await User.findOne({
          where: {
            role: 'admin',
          },
          attributes: {
            exclude: ['password', 'createdAt', 'updatedAt'],
          },
          include: {
            as: 'profile',
            model: UserProfile,
            attributes: {
              exclude: ['createdAt', 'updatedAt'],
            },
          },
        })

        user.profile.profile_picture = getFileImageUrl(
          user?.profile?.profile_picture,
          'users',
        )

        socket.emit('admin contact loaded', user)
      } catch (err) {
        throw new Error('Cannot get admin contact')
      }
    })

    socket.on('load costumer contact', async () => {
      let users = await User.findAll({
        include: [
          {
            model: Chat,
            as: 'recipient',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'idRecipient', 'idSender'],
            },
          },
          {
            model: Chat,
            as: 'sender',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'idRecipient', 'idSender'],
            },
          },
          'profile',
        ],
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt'],
        },
        where: {
          role: 'user',
        },
      })

      users = users.map((user, index) => {
        user.profile.profile_picture = getFileImageUrl(
          user?.profile?.profile_picture,
          'users',
        )

        return user
      })

      socket.emit('user contact loaded', users)
    })

    socket.on('load message', async (payload) => {
      const { idRecipient } = payload
      const userId = userToken.id

      console.log(payload, userId, userToken)

      try {
        const chats = await Chat.findAll({
          where: {
            idRecipient: {
              [Op.or]: [idRecipient, userId],
            },
            idSender: {
              [Op.or]: [idRecipient, userId],
            },
          },
          include: [
            {
              model: User,
              as: 'recipient',
              attributes: {
                exclude: ['createdAt', 'updatedAt', 'password'],
              },
              include: 'profile',
            },
            {
              model: User,
              as: 'sender',
              attributes: {
                exclude: ['createdAt', 'updatedAt', 'password'],
              },
            },
          ],
          order: [['timestamp', 'ASC']],
          attributes: {
            exclude: ['idRecipient', 'idSender'],
          },
        })

        socket.emit('message loaded', chats)
      } catch (err) {
        console.log(err)
        socket.emit('error', "Can't load chats")
      }
    })

    socket.on('send message', async (payload) => {
      const { message, idRecipient } = payload
      try {
        await Chat.create({
          idSender,
          idRecipient,
          message,
          timestamp: Date.now(),
        })

        io.to(socket.id)
          .to(connectUser[idRecipient])
          .emit('new message', idRecipient)
      } catch (err) {
        console.log(err)
        io.emit('error', 'Cannot send message')
      }
    })

    socket.on('disconnect', () => {
      console.log(`User disconnected with id: ${socket.id}`)
      delete connectUser[idSender]
    })
  })
}
