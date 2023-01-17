export interface ObjectData {
    id: number,
    name: string
}
// 推荐
export interface RecommendListData {
    comic_id: number,
    title: string,
    sub_title: number,
    img: string,
    jump_value: string,
    styles: [ObjectData],
    comment_total: number,
    vertical_cover: string,
    ext: object,
    recommend_type: number,
    id: number,
    type: number,
    jump_type: number,
    icon: number,
    introduction: string,
    labels: Array<object>,
    description: string,
    allow_wait_free: boolean,
    column: null,
    combine: null,
    anime: null,
    comments: [
    ],
    columns: [
    ],
    discount_type: number,
    last_ep_title: string,
    page_num: number,
    review_score: number,
    pv_info: {
        aid: number,
        cid: number,
        pv_start_at: number,
        is_vertical: boolean
    },
    rank: {
        rank: number,
        name: string
    },
    discount: number,
    tags: [
    ],
    authors: [
        string
    ],
    favorite_state: number,
    style_rank: number,
    rookie_type: number,
    decision_info: string,
    new_comic: boolean
}


export interface RecommendData {
    seed: string,
    ab_test: boolean,
    list: [RecommendListData],
    ab_read_history: boolean,
    tab_ab_test: boolean
}
// 免费  完结  日漫  男生  女生  宝藏
export interface NoMoneyData {
    season_id: number
    comic_id: number,
    title: string,
    author: [string, string],
    vertical_cover: string,
    horizontal_cover: string
    is_finish: number,
    last_ord: number,
    last_short_title: string,
    styles: [ObjectData],
    total: number,
    fans: string,
    reward_users: [],
    last_rank: number,
    last_ep: number,
    text: string,
    rookie_type: number,
    allow_wait_free: false,
    discount_type: number,
    home_block_jump_value: string
    bottom_info: string
}


// 热血
export interface RexueData {
    season_id: number,
    title: string,
    horizontal_cover: string,
    square_cover: string,
    vertical_cover: string,
    is_finish: number,
    status: number,
    last_ord: number,
    total: number,
    release_time: string,
    last_short_title: string,
    discount_type: number,
    allow_wait_free: false,
    type: number,
    bottom_info: string,
    bottom_info_v2: [string]
}
// 轮播图
export interface SwiperData {
    allow_wait_free: false
    discount_type: 0
    ext: ""
    horizontal_cover: string
    is_finish: number
    last_ord: number
    last_short_title: string
    recommend_reason: ""
    release_time: ""
    season_id: number
    square_cover: string
    status: number
    styles: [string]
    title: string
    total: number
    vertical_cover: string
}
// 数据类型
export interface DataType {
    data: [NoMoneyData]
}
// 章节目录
export interface chaptersNumber {
    cover: string
    deadline: string
    gold: number
    id: number
    is_finished: number
    short_title: string
    status: number
    title: string
}

// 章节目录信息
export interface chaptersNumberXinXi {
    chapter_id: number
    comments: number
    cover: string
    id: number
    image_count: number
    like_count: number
    ord: number
    pub_time: string
    read: number
    short_title: string
    size: number
    title: string
    extra:number
    pay_mode:number
    type: number
    
}
// 漫画详情
export interface ManHuaDetails {
    author_name: [string, string],
    title: string,
    chapters: [chaptersNumber],
    classic_lines: string,
    horizontal_cover: string,
    id: number,
    interact_value: string,
    introduction: string,
    is_finish: number,
    styles: [string],
    total: number,
    vertical_cover: string,
    last_short_title: string,
 
    ep_list: [chaptersNumberXinXi]
}

// 分类内容
export interface ClassifyTitleData {
    bottom_info: string
    bottom_info_v2: [string]
    discount_type: number
    horizontal_cover: string
    is_finish: number
    last_ord: number
    last_short_title: string
    release_time: string
    season_id: number
    square_cover: string
    status: number
    title: string
    total: number
    type: number
    vertical_cover: string
}

export interface userDataType {
    mobileNum: string,
    pass: number
}

export interface userDataNews {
    birthday: string
    gender: boolean
    img: string
    introduce: string
    name: string
    phone: string
}

export interface readHistory {
    name: string
    author: string
    img: string
    upDate: string
    id: number
    isFinish: number
}

export interface collectManHua {
    name: string
    author: string
    img: string
    upDate: string
    id: number
    isFinish: number
    isCollect: boolean
}


export interface rankingListData {
    id: number,
    type: number,
    description: string,
    name: string
}

export interface rankingListDetailsData {
    comic_id: number,
    home_block_jump_value: string,
    author: [string, string],
    title: string,
    vertical_cover: string,
    last_short_title: string,

}

export interface getSeachResultList {
    allow_wait_free: false
    author_name: [string]
    is_finish: number
    horizontal_cover: string
    id: number
    org_title: string
    styles: [string]
    title: string
    type: number
    vertical_cover: string
}

