import http from "@/http";

import type { RecommendData, DataType } from "@/typings"

export const Api = {
    getClassifyResult: (id: number, aid: number, uid: number, oid: number) => {
        return http.request({
            url: `/api/ClassPage?styleId=${id}&areaId=${aid}&isFinish=${uid}&order=${oid}&pageNum=1&pageSize=39&isFree=-1`,
            method: 'get'
        })
    },
    getClassifyTitleData: () => {
        return http.request({
            url: '../../public/data/classifyData.json',
            method: 'get'
        })
    },
    getRecommendData: () => {
        return http.request<RecommendData>({
            // url:'/HomeRecommend',
            url: '../../public/data/recommendList.json',
            method: 'get'
        })
    },
    getRecommendSwiperList: () => {
        return http.request<DataType>({
            // url:'/Recommend',
            url: '../../public/data/swiper.json',
            method: 'get'
        })
    },
    getOrderOfBirthData: (id: number) => {
        return http.request({
            url: `/GetRankInfo?id=${id}&offset=0&subId=0`,
            method: 'get'
        })
    },
    getRimanData: () => {
        return http.request({
            // url:'/GetRankInfo?id=0&offset=0&subId=0',
            url: '../../public/data/riman.json',
            method: 'get'
        })
    },
    getNoMoneyData: () => {
        return http.request({
            // url:'/GetRankInfo?id=8&offset=0&subId=0',
            url: '../../public/data/nomoney.json',
            method: 'get'
        })
    },
    getWanJieData: () => {
        return http.request({
            // url:'/GetRankInfo?id=13&offset=0&subId=0',
            url: '../../public/data/wanjie.json',
            method: 'get'
        })
    },
    getTreasureData: () => {
        return http.request({
            // url:'/GetRankInfo?id=5&offset=0&subId=0',
            url: '../../public/data/baozang.json',
            method: 'get'
        })
    },
    getGuoManData: () => {
        return http.request({
            // url:'/GetRankInfo?id=1&offset=0&subId=0',
            url: '../../public/data/guoman.json',
            method: 'get'
        })
    },
    getManData: () => {
        return http.request({
            // url:'/GetRankInfo?id=11&offset=0&subId=0',
            url: '../../public/data/man.json',
            method: 'get'
        })
    },
    getWoManData: () => {
        return http.request({
            // url:'/GetRankInfo?id=12&offset=0&subId=0',
            url: '../../public/data/woman.json',
            method: 'get'
        })
    },
    getNewWorkData: () => {
        return http.request({
            // url:'/GetRankInfo?id=7&offset=0&subId=0',
            url: '../../public/data/newman.json',
            method: 'get'
        })
    },
    getWarmBloodData: () => {
        return http.request({
            // url:'/GetRankInfo?id=7&offset=0&subId=0',
            url: '../../public/data/warmblood.json',
            method: 'get'
        })
    },
    getRankingListData: () => {
        return http.request({

            url: '../../public/data/rankinglist.json',
            method: 'get'
        })
    },
    getSeachRecommendData: () => {
        return http.request({

            url: '../../public/data/seachtuijian.json',
            method: 'get'
        })
    },
    getManHuaData: (id?: number) => {
        return http.request({
            url: '/api/ComicDetail?comicId=' + id,
            method: 'get'
        })
    },
    getRankingListDetailsData: (id?: number) => {
        return http.request({
            url: '/api/GetRankInfo?id=' + id + '&offset=0&subId=0',
            method: 'get'
        })
    },
    getSeachAdviseData: (str?: string | number) => {
        return http.request({
            url: '/api/SearchSug??term=' + str + '&num=10',
            method: 'get'
        })
    },
    getSeachResultData: (str?: string | number) => {
        return http.request({
            url: '/api/Search?styleId=-1&areaId=2&isFinish=-1&order=-1&pageNum=1&pageSize=20&isFree=-1&keyWord=' + str,
            method: 'get'
        })
    },
    getManHuaOne: (id: number) => {
        return http.request({
            url: '/api/ComicDetail?comicId=' + id,
            method: 'get'
        })
    },

    getManHuaTwo: (id: any) => {
        return http.request({
            // url: '/api/GetImageIndex?epId=' + id,
            url: '/api/GetImageIndex?epId=' + id,
            method: 'get'
        })
    },
    getManHuaThree: (url: any) => {
        return http.request({
            url: '/api/ImageToken?urls=[%22https://manga.hdslb.com' + url + '%22]',
            method: 'get'
        })
    },


}