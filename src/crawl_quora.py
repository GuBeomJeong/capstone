import csv
from GoogleScraper import scrape_with_config, GoogleSearchError



# 검색 결과를 확인 하는 함수
def test_google_search(search):
    # let's inspect what we got
    for serp in search.serps:
        print('=' * 50)
        print('serp', serp)
        print('serp.search_engine_name: ', serp.search_engine_name)
        print('serp.scrape_method: ', serp.scrape_method)
        print('serp.page_number: ', serp.page_number)
        print('serp.requested_at: ', serp.requested_at)
        print('serp.num_results: ', serp.num_results)
        # ... more attributes ...
        for link in serp.links:
            print(link)
        print('=' * 50)

#  title 에서 부제 제거
def preprocess_title(title):
    if len(title.split('-')) > 1:
        title = title.split('-')[0]
    elif len(title.split('|')) > 1:
        title = title.split('|')[0]
    p_title = title
    return p_title

def get_config(**kwargs):
    config = {
        'use_own_ip': True,
        'keyword': kwargs['keyword'],
        'search_engines': ['google'],
        'num_pages_for_keyword': kwargs['num_pages'],
        'scrape_method': 'selenium',
        'sel_browser': 'chrome',
        'do_caching': False,
        'output_filename': kwargs['filename'],
    }
    return config

# keyword = input('input question :') + ' site:www.quora.com'
# keyword = "What is the best way to make money online? site:www.quora.com"


def crawl_data(keyword):
    file_num = 0
    output_filename = './crawling_output/output_{}.csv'.format(file_num)
    params = {
        'keyword': keyword,
        'num_pages': 1,
        'filename': output_filename,
        }

    config = get_config(**params)
    title_list = []
    title_origin_list = []
    similarity_list = []
    link_list = []
    dict_idx = 0
    output_dict = {}

    try:
        search = scrape_with_config(config)
    except GoogleSearchError as e:
        print(e)
    else:
        # 검색 결과를 확인하는 함수
        # test_google_search(search)

        # open scv file
        with open(output_filename, 'r', newline='') as csv_file:
            # csv_reader = csv.reader(csv_file, delimiter=',')
            csv_reader = csv.DictReader(csv_file, delimiter=',')

            for row in csv_reader:
                title_origin = row['title']
                title = row['title']
                link = row['link']

                # title 에서 부제 제거
                # 'title - src site'와 같이 - or | 있으면 자르기
                title = preprocess_title(title)
                title = preprocess_title(title)

                # dictionary element 만들어서 추가
                dict_element = {
                    'title' : title,
                    'title_origin' : title_origin,
                    'similarity' : 0.0,
                    'link' : link,
                }
                output_dict[dict_idx] = dict_element

                title_list.append(title)
                title_origin_list.append(title_origin)
                link_list.append(row['link'])

                dict_idx += 1

                # 없으면 문장 그대로
            csv_file.close()

    return title_list