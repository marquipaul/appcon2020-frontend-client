<template>
    <v-menu
      
      v-model="menu"
      :close-on-content-click="false"
      :max-width="400"
      :min-width="400"
      top 
      offset-y
      offset-x
    >
       <template v-slot:activator="{ on }">
        <v-btn
            v-on="on"
            v-model="menu"
            color="blue"
            dark
            fab
            bottom
            fixed
        >
        <v-badge color="blue-grey darken-3 white--text" right>
            <template v-slot:badge>{{unreadCount}}</template>
            <v-icon v-if="menu">mdi-close</v-icon>
            <v-icon v-else>mdi-forum</v-icon>
        </v-badge>
          
        </v-btn>
      </template>

      <v-card min-height="500" max-height="500" style="overflow-y: hidden;">
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <v-icon>mdi-forum</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{currentUser.staff_group.group_name}}</v-list-item-title>
              <v-list-item-subtitle>Group Chat</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn
                icon
                @click="menu = false"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <!-- <v-progress-linear
            height="1"
            indeterminate
            v-if="loading"
        ></v-progress-linear> -->
        <v-card-text style="height: 350px; overflow: auto;"  @scroll="onScroll" v-chat-scroll="{always: false, smooth: true, scrollonremoved:true}">
            <div v-for="(item, index) in chats" :key="index">
                <div>
                    <div v-if="currentUser.id == item.user_id" class="outgoing_msg">
                        <div class="sent_msg">
                            <p>{{item.chat}}</p>
                        <span class="time_date_sent"> {{moment(item.created_at).format('LT')}} | You</span> </div>
                    </div>

                    <div v-else class="incoming_msg">
                        <div class="received_msg">
                            <p>{{item.chat}}</p>
                            <span class="time_date_received"> {{moment(item.created_at).format('LT')}} | {{item.user.name}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
                <v-text-field
                    v-model="message"
                    color="blue"
                    label="Type a message..."
                    append-icon="mdi-send"
                    @click:append="submitMessage"
                    v-on:keyup.enter="submitMessage"
                    :loading="loading"
                ></v-text-field>
        </v-card-actions>
      </v-card>
    </v-menu>
</template>
<script>
var moment = require('moment');
import Vue from 'vue';
import VueChatScroll from 'vue-chat-scroll';
import 'vue-chat-scroll/dist/vue-chat-scroll.js';
Vue.use(VueChatScroll);
export default {
    data() {
        return {
            moment: moment,
            menu: false,
            loading: false,
            message: '',
            sender_id: 0,
            per_page: 15
        };
    },
  created() {
      this.listenChat()
  },
  watch: {
    menu: {
      handler() {
        if (this.menu) {
          this.clearConversation()
          this.getGroupConversations()
        } else {
          this.clearConversation()
        }
      },
      deep: true
    }
  },
  methods: {
      listenChat() {
        var audio = new Audio('sounds/chat.mp3')
        var groupId = this.currentUser.staff_group_id;
        var userId = this.currentUser.id;
          window.Echo.private(`group-chat.${groupId}`)
            .listen('BroadcastGroupChat', (e) => {
                if (e.chat.staff_group_id == groupId) {
                  if (userId != e.chat.user_id) {
                    this.$store.commit('pushChat', e.chat)
                    this.$store.commit('addUnreadCount')
                    audio.play()
                    audio.muted = false;
                    //this.desktopNotification(e.chat.user.name)
                  }
                  this.sender_id = e.chat.user_id
                  console.log('pasok', e)
                }
                
            })
            this.getGroupConversations()
      },
      submitMessage() {
        if (this.message) {
          this.sendMessage()
        }
      },
      sendMessage() {
        let form = {
          staff_group_id: this.currentUser.staff_group_id,
          chat: this.message
        }
        this.loading = true
        this.$store.dispatch('sendChat', form)
          .then(res => {
            this.loading = false
            this.message = ''
          })
    },
    onScroll ({ target: { scrollTop, clientHeight, scrollHeight }}) {
      if (scrollTop + clientHeight >= scrollHeight) {
        if (this.currentUser.staff_group_id) {
          if (this.menu) {
            if (this.sender_id !== this.currentUser.id) {
              this.getGroupConversations()
            }
          }
        }
      } else if (scrollTop === 0) {
        this.per_page+=8
        this.getGroupConversations()
      }
    },
    getGroupConversations() {
      this.loading = true
      let params = {
        read: this.menu? true : null,
        per_page: this.per_page
      }
      this.$store.dispatch('retrieveGroupConversations', params)
        .then(res => {
          console.log('convo', res)
          this.loading = false
        })
    },
    getConversationForCount() {
      this.loading = true
      this.$store.dispatch('getConversationForCount')
        .then(res => {
          console.log('convo', res)
          this.loading = false
        })
    },
    clearConversation() {
      this.$store.dispatch('clearConversations')
    },
    desktopNotification(name) {
      const notification = {
        title: 'New Message',
        options: {
          body: `${name} send a message to the group`,
          image: 'img/logo.png'
        },
        events: {
          onerror: function () {
              console.log('Custom error event was called');
          },
          onclick: function () {
              console.log('Custom click event was called');
          },
          onclose: function () {
              console.log('Custom close event was called');
          },
          onshow: function () {
              console.log('Custom show event was called');
          }
        }
      }
      this.$notification.show(notification.title, notification.options, notification.events)
    }
  },
  computed: {
    currentUser(){
      return JSON.parse(this.$store.state.auth.currentUser)
    },
    chats(){
      return this.$store.getters['retrieveChats']
    },
    unreadCount() {
      return this.$store.getters['retrieveUnreadCount']
    }
  }
}
</script>
<style scoped>

  .v-menu__content {
    border-radius: 12px !important;
  }

.wrapper {
  position: relative;
}

.time_date_sent {
  float: right;
  color: #747474;
  display: block;
  font-size: 12px;
  margin: 8px 0 0;
}

.time_date_received {
  float: right;
  color: #747474;
  display: block;
  font-size: 12px;
  margin: 8px 0 0;
}

.received_withd_msg { 
    width: auto;
    min-width: 46%;
    max-width: 90%;
}
.mesgs {
  float: left;
  padding: 30px 15px 0 25px;
  width: 60%;
}

 .sent_msg p {
  background: #42a5f5 none repeat scroll 0 0;
  border-radius: 20px 20px 3px 20px;
  font-size: 14px;
  margin: 0; color:#fff;
  padding: 5px 10px 5px 12px;
  width:100%;
}
.outgoing_msg{ overflow:hidden; margin:26px 0 26px;}
.sent_msg {
  float: right;
  width: auto;
  min-width: 46%;
  max-width: 90%;
}




 .received_msg p {
  background: #ebebeb none repeat scroll 0 0;
  border-radius: 20px 20px 20px 3px;
  font-size: 14px;
  margin: 0; color:#646464;;
  padding: 5px 10px 5px 12px;
  width:100%;
}
.incoming_msg{ overflow:hidden; margin:26px 0 26px;}
.received_msg {
  float: left;
  width: auto;
  min-width: 46%;
  max-width: 90%;
}

</style>