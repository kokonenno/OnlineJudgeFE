<template>
  <el-row type="flex" :gutter="20">
    <el-col :md="10" :lg="8">
      <el-card class="admin-info">
        <el-row :gutter="20">
          <el-col :span="10">
            <img class="avatar" :src="profile.avatar"/>
          </el-col>
          <el-col :span="14">
            <p class="admin-info-name">{{user.username}}</p>
            <p>{{user.admin_type}}</p>
          </el-col>
        </el-row>
        <hr/>
        <div class="last-info">
          <p class="last-info-title">{{$t('m.Last_Login')}}</p>
          <el-form label-width="80px" class="last-info-body">
            <el-form-item label="Time:">
              <span>{{session.last_activity | localtime}}</span>
            </el-form-item>
            <el-form-item label="IP:">
              <span>{{session.ip}}</span>
            </el-form-item>
            <el-form-item label="OS">
              <span>{{os}}</span>
            </el-form-item>
            <el-form-item label="Browser:">
              <span>{{browser}}</span>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
      <panel :title="$t('m.System_Overview')" v-if="isSuperAdmin">
        <p>{{$t('m.DashBoardJudge_Server')}}:  {{infoData.judge_server_count}}</p>
        <p>{{$t('m.HTTPS_Status')}}:
          <el-tag :type="https ? 'success' : 'danger'" size="small">
            {{ https ? 'Enabled' : 'Disabled'}}
          </el-tag>
        </p>
        <p>{{$t('m.Force_HTTPS')}}:
          <el-tag :type="forceHttps ? 'success' : 'danger'" size="small">
            {{forceHttps ? 'Enabled' : 'Disabled'}}
          </el-tag>
        </p>
        <p>{{$t('m.CDN_HOST')}}:
          <el-tag :type="cdn ? 'success' : 'warning'" size="small">
            {{cdn ? cdn : 'Not Use'}}
          </el-tag>
        </p>
      </panel>
    </el-col>

    <el-col :md="14" :lg="16" v-if="isSuperAdmin">
      <div class="info-container">
        <info-card color="#909399" icon="el-icon-fa-users" message="Total Users" iconSize="30px" class="info-item"
                   :value="infoData.user_count"></info-card>
        <info-card color="#67C23A" icon="el-icon-fa-list" message="Today Submissions" class="info-item"
                   :value="infoData.today_submission_count"></info-card>
        <info-card color="#409EFF" icon="el-icon-fa-trophy" message="Recent Contests" class="info-item"
                   :value="infoData.recent_contest_count"></info-card>
      </div>
      <panel style="margin-top: 5px">
        <span slot="title" v-loading="loadingReleases">Release Notes
        <el-popover placement="right" trigger="hover">
          <i slot="reference" class="el-icon-fa-question-circle import-user-icon"></i>
          <p>新しい機能をお楽しみいただくために、最新バージョンにアップグレードしてください。</p>
          <p>参照: <a href="https://jna.nivms.com/ni/niware/workflow/" target="_blank">
          NI Collabo</a>
          </p>
        </el-popover>
        </span>
        <el-collapse v-model="activeNames" v-for="(release, index) of releases" :key="'release' + index">
          <el-collapse-item :name="index+1">
            <template slot="title">
              <div v-if="release.new_version">{{release.title}}
                <el-tag size="mini" type="success">New Version</el-tag>
              </div>
              <span v-else>{{release.title}}</span>
            </template>
            <p>Level: {{release.level}}</p>
            <p>Details: </p>
            <div class="release-body">
              <ul v-for="detail in release.details" :key="detail">
                <li v-html="detail"></li>
              </ul>
            </div>
          </el-collapse-item>
        </el-collapse>
      </panel>
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters } from 'vuex'
import browserDetector from 'browser-detect'
import InfoCard from '@admin/components/infoCard.vue'
import releaseNotes from '@/assets/data/releaseNotes.json' // ✅ JSON 파일 추가

export default {
  name: 'dashboard',
  components: {
    InfoCard
  },
  data () {
    return {
      infoData: {
        user_count: 0,
        recent_contest_count: 0,
        today_submission_count: 0,
        judge_server_count: 0,
        env: {}
      },
      activeNames: [1],
      session: {},
      loadingReleases: false, // ✅ API 사용 안 하므로 false로 설정
      releases: [] // Release Notes 데이터를 저장할 배열
    }
  },
  mounted () {
    this.loadReleaseNotes() // ✅ API 없이 로컬 JSON에서 데이터 불러오기
  },
  methods: {
    loadReleaseNotes () {
      // ✅ JSON 파일에서 Release Notes 데이터 로드
      console.log('📌 로컬 Release Notes 데이터 로드 중...', releaseNotes) // 데이터 확인용

      if (!releaseNotes || !releaseNotes.update) {
        console.warn('🚨 Release Notes 데이터가 비어 있습니다.')
        return
      }

      let currentVersion = releaseNotes.local_version
      releaseNotes.update.forEach(release => {
        if (release.version > currentVersion) {
          release.new_version = true
        }
      })
      this.releases = releaseNotes.update
      console.log('✅ 로컬에서 불러온 Release Notes:', this.releases)
    }
  },
  computed: {
    ...mapGetters(['profile', 'user', 'isSuperAdmin']),
    cdn () {
      return this.infoData.env.STATIC_CDN_HOST
    },
    https () {
      return document.URL.slice(0, 5) === 'https'
    },
    forceHttps () {
      return this.infoData.env.FORCE_HTTPS
    },
    browser () {
      let b = browserDetector(this.session.user_agent)
      return b.name && b.version ? `${b.name} ${b.version}` : 'Unknown'
    },
    os () {
      let b = browserDetector(this.session.user_agent)
      return b.os || 'Unknown'
    }
  }
}
</script>

<style lang="less">
  .admin-info {
    margin-bottom: 20px;
    &-name {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 10px;
      color: #409EFF;
    }
    .avatar {
      max-width: 100%;
    }
    .last-info {
      &-title {
        font-size: 16px;
      }
      &-body {
        .el-form-item {
          margin-bottom: 5px;
        }
      }
    }
  }

  .info-container {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .info-item {
      flex: 1 0 auto;
      min-width: 200px;
      margin-bottom: 10px;
    }
  }

</style>
